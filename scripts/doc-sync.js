#!/usr/bin/env node
/* eslint-disable regexp/no-super-linear-backtracking */

/* eslint-disable regexp/optimal-quantifier-concatenation */

/**
 * Documentation Sync Validator for Compote
 *
 * This script analyzes Vue components, composables, and documentation
 * to ensure they stay in sync.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

// ANSI color codes
const colors = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
}

const log = {
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  section: msg => console.log(`\n${colors.magenta}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`),
}

/**
 * Parse Vue component file to extract props, events, and exposed
 */
function parseVueComponent(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const componentName = basename(filePath, '.vue')

  const result = {
    name: componentName,
    props: [],
    events: [],
    exposed: null,
    composable: null,
  }

  // Extract props from defineProps<{...}>
  const propsMatch = content.match(/defineProps<\{([^}]+)\}>\(\)/)
  if (propsMatch) {
    const propsContent = propsMatch[1]
    const propLines = propsContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'))

    propLines.forEach((line) => {
      const match = line.match(/(\w+)\??:\s*(.+)/)
      if (match) {
        const [, name, type] = match
        const isOptional = line.includes('?:')
        result.props.push({
          name: name.trim(),
          type: type.trim(),
          optional: isOptional,
        })
      }
    })
  }

  // Extract default values from withDefaults
  const defaultsMatch = content.match(/withDefaults\([^,]+,\s*\{([^}]+)\}/)
  if (defaultsMatch) {
    const defaultsContent = defaultsMatch[1]
    result.props.forEach((prop) => {
      const match = defaultsContent.match(new RegExp(`${prop.name}:\\s*(.+?)[,\\n]`))
      if (match) {
        prop.default = match[1].trim().replace(/['"]/g, '')
      }
    })
  }

  // Extract events from defineEmits<{...}>
  const emitsMatch = content.match(/defineEmits<\{([^}]+)\}>\(\)/)
  if (emitsMatch) {
    const emitsContent = emitsMatch[1]
    const eventLines = emitsContent.split('\n').filter(line => line.trim())

    eventLines.forEach((line) => {
      const match = line.match(/(\w+):\s*\[(.+?)\]/)
      if (match) {
        const [, name, types] = match
        result.events.push({
          name: name.trim(),
          type: types.trim(),
        })
      }
    })
  }

  // Extract exposed values
  const exposedMatch = content.match(/defineExpose\(([^)]+)\)/)
  if (exposedMatch) {
    result.exposed = exposedMatch[1].trim()
  }

  // Extract composable usage (look for main composable, not helpers)
  const importMatches = content.matchAll(/import\s*\{[^}]*(use\w+)[^}]*\}\s*from\s*['"].*composables\/(\w+)['"]/g)
  for (const match of importMatches) {
    const composableName = match[1]
    const fileName = match[2]
    // Skip helper composables (those starting with underscore)
    if (!fileName.startsWith('_')) {
      result.composable = composableName
      break
    }
  }

  return result
}

/**
 * Parse Vue composable to extract state and methods
 */
function parseComposable(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const name = basename(filePath, '.ts')

  const result = {
    name: `use${name.charAt(0).toUpperCase() + name.slice(1)}`,
    state: [],
    methods: [],
    parameters: [],
  }

  // Extract state interface
  const stateMatch = content.match(/export interface \w+ComposableState \{([^}]+)\}/)
  if (stateMatch) {
    const stateContent = stateMatch[1]
    const stateLines = stateContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'))

    stateLines.forEach((line) => {
      const match = line.match(/(\w+):\s*(.+)/)
      if (match) {
        const [, name, type] = match
        result.state.push({
          name: name.trim(),
          type: type.trim(),
        })
      }
    })
  }

  // Extract methods from actions interface
  const actionsMatch = content.match(/export interface \w+ComposableActions \{([^}]+)\}/)
  if (actionsMatch) {
    const actionsContent = actionsMatch[1]
    const methodLines = actionsContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'))

    methodLines.forEach((line) => {
      const match = line.match(/(\w+):\s*\(([^)]*)\)\s*=>\s*(.+)/)
      if (match) {
        const [, name, params, returnType] = match
        result.methods.push({
          name: name.trim(),
          params: params.trim(),
          returnType: returnType.trim(),
        })
      }
    })
  }

  // Extract function parameters
  const funcMatch = content.match(/export function use\w+\(([^)]+)\)/)
  if (funcMatch) {
    const params = funcMatch[1].split(',').map((p) => {
      const match = p.trim().match(/(\w+)(\??):\s*(.+)/)
      if (match) {
        const [, name, optional, type] = match
        return {
          name: name.trim(),
          type: type.trim(),
          optional: !!optional,
        }
      }
      return null
    }).filter(Boolean)
    result.parameters = params
  }

  return result
}

/**
 * Parse documentation to extract documented components
 */
function parseComponentDocs(filePath) {
  if (!existsSync(filePath)) {
    return []
  }

  const content = readFileSync(filePath, 'utf-8')
  const components = []

  // Match component sections (## ComponentName)
  const sections = content.split(/^## /m).slice(1)

  sections.forEach((section) => {
    const lines = section.split('\n')
    const name = lines[0].trim()

    const component = {
      name,
      props: [],
      events: [],
      hasExposed: section.includes('### Exposed'),
    }

    // Extract props table
    const propsTableMatch = section.match(/### Props\s+\|[^\n][^\n|]*\|[^\n]+\|\s+((?:\|[^\n]+\|\s*)+)/)
    if (propsTableMatch) {
      const rows = propsTableMatch[1].split('\n').filter(line => line.trim().startsWith('|'))
      rows.forEach((row) => {
        // Skip separator rows (e.g., | --- | --- | --- |)
        if (row.includes('---'))
          return

        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length >= 3 && cells[0] !== 'Name') {
          component.props.push({
            name: cells[0].replace(/`/g, ''),
            type: cells[1],
            default: cells[2],
          })
        }
      })
    }

    // Extract events table
    const eventsTableMatch = section.match(/### Events\s+\|[^\n][^\n|]*\|[^\n]+\|\s+((?:\|[^\n]+\|\s*)+)/)
    if (eventsTableMatch) {
      const rows = eventsTableMatch[1].split('\n').filter(line => line.trim().startsWith('|'))
      rows.forEach((row) => {
        // Skip separator rows (e.g., | --- | --- | --- |)
        if (row.includes('---'))
          return

        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length >= 2 && cells[0] !== 'Name') {
          component.events.push({
            name: cells[0].replace(/`/g, ''),
            type: cells[1],
          })
        }
      })
    }

    components.push(component)
  })

  return components
}

/**
 * Parse composables documentation
 */
function parseComposableDocs(filePath) {
  if (!existsSync(filePath)) {
    return { list: [], states: [] }
  }

  const content = readFileSync(filePath, 'utf-8')
  const result = { list: [], states: [] }

  // Extract list table
  const listMatch = content.match(/## List\s+\|[^\n][^\n|]*\|[^\n]+\|\s+((?:\|[^\n]+\|\s*)+)/)
  if (listMatch) {
    const rows = listMatch[1].split('\n').filter(line => line.trim().startsWith('|'))
    rows.forEach((row) => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean)
      if (cells.length >= 3) {
        const nameMatch = cells[0].match(/use(\w+)/)
        if (nameMatch) {
          result.list.push({
            name: cells[0],
            state: cells[1],
            methods: cells[2],
          })
        }
      }
    })
  }

  // Extract state sections
  const stateSections = content.match(/### (use\w+)\s+\|[^\n][^\n|]*\|[^\n]+\|\s+((?:\|[^\n]+\|\s*)+)/g)
  if (stateSections) {
    stateSections.forEach((section) => {
      const nameMatch = section.match(/### (use\w+)/)
      const name = nameMatch ? nameMatch[1] : ''

      const properties = []
      const rows = section.match(/\|[^\n]+\|[^\n]+\|[^\n]+\|/g)
      if (rows) {
        rows.slice(2).forEach((row) => {
          const cells = row.split('|').map(c => c.trim()).filter(Boolean)
          if (cells.length >= 3) {
            properties.push({
              name: cells[0].replace(/`/g, ''),
              type: cells[1],
              description: cells[2],
            })
          }
        })
      }

      result.states.push({ name, properties })
    })
  }

  return result
}

/**
 * Compare component implementation with documentation
 */
function validateComponent(component, documentation) {
  const issues = []
  const docComponent = documentation.find(d => d.name === component.name)

  if (!docComponent) {
    issues.push({
      severity: 'error',
      message: `${component.name} is not documented in components.md`,
    })
    return issues
  }

  // Check props
  component.props.forEach((prop) => {
    const docProp = docComponent.props.find(p => p.name === prop.name)
    if (!docProp) {
      issues.push({
        severity: 'error',
        message: `${component.name} prop '${prop.name}' is missing in documentation`,
      })
    }
  })

  // Check for documented props that don't exist
  docComponent.props.forEach((docProp) => {
    const prop = component.props.find(p => p.name === docProp.name)
    if (!prop) {
      issues.push({
        severity: 'warning',
        message: `${component.name} has documented prop '${docProp.name}' that doesn't exist in implementation`,
      })
    }
  })

  // Check events
  component.events.forEach((event) => {
    const docEvent = docComponent.events.find(e => e.name === event.name)
    if (!docEvent) {
      issues.push({
        severity: 'error',
        message: `${component.name} event '${event.name}' is missing in documentation`,
      })
    }
  })

  // Check for documented events that don't exist
  docComponent.events.forEach((docEvent) => {
    const event = component.events.find(e => e.name === docEvent.name)
    if (!event) {
      issues.push({
        severity: 'warning',
        message: `${component.name} has documented event '${docEvent.name}' that doesn't exist in implementation`,
      })
    }
  })

  // Check exposed
  if (component.exposed && !docComponent.hasExposed) {
    issues.push({
      severity: 'warning',
      message: `${component.name} exposes values but documentation doesn't mention 'Exposed' section`,
    })
  }

  return issues
}

/**
 * Validate composable implementation with documentation
 */
function validateComposable(composable, documentation) {
  const issues = []
  const docComposable = documentation.list.find(d => d.name.includes(composable.name))

  if (!docComposable) {
    issues.push({
      severity: 'error',
      message: `${composable.name} is not listed in composables.md list table`,
    })
  }

  const docState = documentation.states.find(s => s.name === composable.name)
  if (!docState) {
    issues.push({
      severity: 'error',
      message: `${composable.name} state section is missing in composables.md`,
    })
    return issues
  }

  // Check state properties
  composable.state.forEach((state) => {
    const docProp = docState.properties.find(p => p.name === state.name)
    if (!docProp) {
      issues.push({
        severity: 'error',
        message: `${composable.name} state property '${state.name}' is missing in documentation`,
      })
    }
  })

  // Check for documented properties that don't exist
  docState.properties.forEach((docProp) => {
    const state = composable.state.find(s => s.name === docProp.name)
    if (!state) {
      issues.push({
        severity: 'warning',
        message: `${composable.name} has documented state '${docProp.name}' that doesn't exist in implementation`,
      })
    }
  })

  return issues
}

/**
 * Check consistency between component and composable
 */
function validateConsistency(component, composables) {
  const issues = []

  // Skip trigger/menu/helper components - they don't need main composables
  const helperComponents = ['Trigger', 'Menu', 'Back', 'Next']
  const isHelperComponent = helperComponents.some(helper => component.name.includes(helper))

  if (!component.composable) {
    if (!isHelperComponent && component.props.length > 0) {
      issues.push({
        severity: 'info',
        message: `${component.name} doesn't appear to use a composable (this may be intentional)`,
      })
    }
    return issues
  }

  const composable = composables.find(c => c.name === component.composable)
  if (!composable) {
    issues.push({
      severity: 'error',
      message: `${component.name} references ${component.composable} which doesn't exist`,
    })
    return issues
  }

  // Check that component with options prop matches composable parameters
  const optionsProp = component.props.find(p => p.name === 'options')
  if (optionsProp && composable.parameters.length > 1) {
    // Good - component has options and composable accepts options parameter
  }

  // Note: Event-to-state validation is disabled as it produces false positives
  // Events like 'show', 'shown', 'hide', 'hidden' update state but are transition events
  // Not all events need to map directly to a state property

  return issues
}

/**
 * Main execution
 */
function main() {
  log.section('📚 Documentation Sync Validator')

  const componentsPath = join(ROOT, 'packages/vue/src/components')
  const composablesPath = join(ROOT, 'packages/vue/src/composables')
  const componentDocsPath = join(ROOT, 'docs/guide/vue/components.md')
  const composableDocsPath = join(ROOT, 'docs/guide/vue/composables.md')

  // Parse all Vue components
  log.info('Parsing Vue components...')
  const componentFiles = readdirSync(componentsPath)
    .filter(f => f.endsWith('.vue') && f.startsWith('C'))

  const components = componentFiles.map(file =>
    parseVueComponent(join(componentsPath, file)),
  )
  log.success(`Found ${components.length} Vue components`)

  // Parse all composables
  log.info('Parsing composables...')
  const composableFiles = readdirSync(composablesPath)
    .filter(f => f.endsWith('.ts') && !f.startsWith('_'))

  const composables = composableFiles.map(file =>
    parseComposable(join(composablesPath, file)),
  )
  log.success(`Found ${composables.length} composables`)

  // Parse documentation
  log.info('Parsing documentation...')
  const componentDocs = parseComponentDocs(componentDocsPath)
  const composableDocs = parseComposableDocs(composableDocsPath)
  log.success(`Found ${componentDocs.length} documented components`)
  log.success(`Found ${composableDocs.list.length} documented composables`)

  // Validate
  log.section('🔍 Validation Results')

  let totalIssues = 0
  let errorCount = 0
  let warningCount = 0

  // Validate components
  log.info('Validating components against documentation...')
  components.forEach((component) => {
    const issues = validateComponent(component, componentDocs)
    issues.forEach((issue) => {
      totalIssues++
      if (issue.severity === 'error') {
        errorCount++
        log.error(issue.message)
      }
      else if (issue.severity === 'warning') {
        warningCount++
        log.warning(issue.message)
      }
      else {
        log.info(issue.message)
      }
    })

    if (issues.length === 0) {
      log.success(`${component.name} documentation is up to date`)
    }
  })

  // Validate composables
  log.info('\nValidating composables against documentation...')
  composables.forEach((composable) => {
    const issues = validateComposable(composable, composableDocs)
    issues.forEach((issue) => {
      totalIssues++
      if (issue.severity === 'error') {
        errorCount++
        log.error(issue.message)
      }
      else if (issue.severity === 'warning') {
        warningCount++
        log.warning(issue.message)
      }
      else {
        log.info(issue.message)
      }
    })

    if (issues.length === 0) {
      log.success(`${composable.name} documentation is up to date`)
    }
  })

  // Validate consistency
  log.info('\nValidating component-composable consistency...')
  components.forEach((component) => {
    const issues = validateConsistency(component, composables)
    issues.forEach((issue) => {
      totalIssues++
      if (issue.severity === 'error') {
        errorCount++
        log.error(issue.message)
      }
      else if (issue.severity === 'warning') {
        warningCount++
        log.warning(issue.message)
      }
      else {
        log.info(issue.message)
      }
    })
  })

  // Summary
  log.section('📊 Summary')
  if (totalIssues === 0) {
    log.success('All documentation is in sync! 🎉')
  }
  else {
    log.info(`Total issues found: ${totalIssues}`)
    if (errorCount > 0) {
      log.error(`Errors: ${errorCount}`)
    }
    if (warningCount > 0) {
      log.warning(`Warnings: ${warningCount}`)
    }
    process.exit(1)
  }
}

main()
