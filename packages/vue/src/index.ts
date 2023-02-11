import { App } from 'vue'
import * as components from './components'

const plugin = {
  install(app: App) {
    for (const prop in components) {
      const component = components[prop]
      app.component(component.name, component)
    }
  }
}

export * from './components'
export { plugin }

