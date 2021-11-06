import { GluegunToolbox } from 'gluegun'
import { screen, box } from 'blessed'
import Web3 from 'web3'
import art from 'ascii-art'

import api from '../services/api'
import help from './help'

export default {
  name: 'auto-matic',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print,
      parameters: { options, first }
    } = toolbox
    const web3 = new Web3(
      'https://polygon-mumbai.infura.io/v3/295cce92179b4be498665b1b16dfee34'
    )

    if (options.h || options.help) {
      await help.run(toolbox)
      return
    }

    if (first === undefined) {
      print.info(
        '\nUsage: \n\n     auto-matic 0x0000000000000000000000000000000000000000\n'
      )
      return
    }

    if (!web3.utils.isAddress(first)) {
      print.info('\ndefine a valid ethereum address\n')

      return
    }

    const appScreen = screen({
      smartCSR: true
    })

    const content = box({
      tags: true,
      align: 'center',
      scrollable: false
    })

    appScreen.append(content)

    appScreen.key(['C-c', 'q', 'escape'], () => {
      process.exit(0)
    })

    const asciiArt = await art.font('autoMatic', 'Doom').completed()

    let interval: any

    async function getWalletBalance(address: string): Promise<number> {
      return Number(await web3.eth.getBalance(address))
    }

    async function renderScreen() {
      try {
        const balance = (await getWalletBalance(first)) / 10 ** 18

        if (balance >= 10) {
          content.setContent(`
            ${asciiArt}\n
            ${balance} MATIC\n\n
            ⚠ Can't get more tokens, you already have enough ⚠
          `)

          interval && clearInterval(interval)
          appScreen.render()
          return
        }

        const { data }: any = await api.post('/transferTokens', {
          address: first,
          network: 'mumbai',
          token: 'maticToken'
        })

        if (data.err.duration) {
          const { duration } = data.err

          clearInterval(interval)
          setTimeout(renderScreen, duration + 1000)
          interval = setInterval(renderScreen, duration + 65000)

          return
        } else if (data.err) {
          clearInterval(interval)
          setTimeout(renderScreen, 2000)
          interval = setInterval(renderScreen, 65000)

          return
        }

        content.setContent(`
          ${asciiArt}\n
          ${(await getWalletBalance(first)) / 10 ** 18} MATIC\n\n      
        `)

        appScreen.render()
      } catch (error) {
        content.setContent(`
          ${asciiArt}\n
          ${(await getWalletBalance(first)) / 10 ** 18} MATIC\n\n        
        `)

        appScreen.render()
      }
    }

    await renderScreen()

    setInterval(renderScreen, 65000)
  }
}
