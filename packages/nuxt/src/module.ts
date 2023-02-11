import { defineNuxtModule, addComponentsDir } from '@nuxt/kit'

// Module options TypeScript inteface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'compotes',
    configKey: 'compotes'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () {
    addComponentsDir({
      path: '@compotes/vue'
    })
  }
})
