import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packages = ['core', 'vue']
const files = ['README.md', 'LICENSE']

for (const pkg of packages) {
  for (const file of files) {
    const src = resolve(root, file)
    const dest = resolve(root, 'packages', pkg, file)
    copyFileSync(src, dest)
    console.log(`Copied ${file} → packages/${pkg}/${file}`)
  }
}
