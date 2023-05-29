export default class ErrorCompotes extends Error {
  constructor(msg: string, params: ErrorOptions = {}, name?: string) {
    super(msg, params)
    this.name = name ? `[c-${name}]` : '[compotes]'
  }
}
