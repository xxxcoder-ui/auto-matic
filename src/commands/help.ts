import { GluegunToolbox } from 'gluegun'

export default {
  name: 'help',
  dashed: true,
  alias: ['h'],
  description: 'Displays auto-matic CLI help',
  run: async function(toolbox: GluegunToolbox) {
    const { print, meta } = toolbox

    print.info(`
      auto-matic version ${meta.version()}\n
      usage: auto-matic 0x0000000000000000000000000000000000000000\n
      commands:\n
      --help, -h: ${this.description}\n
    `)
  }
}
