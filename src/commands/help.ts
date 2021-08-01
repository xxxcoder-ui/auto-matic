import { GluegunToolbox } from "gluegun";

import { version } from "../../package.json";

export default {
  name: "help",
  dashed: true,
  alias: ["h"],
  description: "Displays auto-matic CLI help",
  run: async function (toolbox: GluegunToolbox) {
    const { print } = toolbox;

    print.info(`
      auto-matic version ${version}\n
      usage: auto-matic 0x0000000000000000000000000000000000000000\n
      commands:\n
      --help, -h: ${this.description}\n
    `)

  }
}