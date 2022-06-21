/*
  *IMPORTING NODE CLASSES
*/
const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')

/*
  *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')
const downloadImage = require('../utils/downloadImage')
const getEmojis = require('../utils/getEmojis')

const fileregex = /[<>:"/\\|?*\u0000-\u001F]/g

module.exports = async (arguments) => {
  const { token } = require(resolvePath('../config/global.json'))
  let emojis

  const guildId = arguments[0]
  if (guildId) {
    console.log(`Fetching emojis from the Guild..`)

    await getEmojis(guildId, token).then((data) => {
      data.map(({ name, id }) => (emojis ??= {})[name] = id)
    }).catch(({ code: errorCode, message, errors }) => {
      const errorMessages = [`${colors.bgRed('Discord API has returned an error!')}`]

      if (errorCode) errorMessages.push(`${colors.magenta('Error Code')} ${errorCode}`)
      if (message) errorMessages.push(`${colors.magenta('Message')} ${message}`)
      if (errors) Object.keys(errors).map(key => errors[key]._errors.map(error => errorMessages.push(error.message)))

      if (errorCode == 10004) errorMessages.push(`The provided Guild does not exist!`)
      if (errorCode == 50001) errorMessages.push(`To download emojis from a guild, you must be a member of that guild!`)

      console.error(errorMessages.join('\n'))
      return process.exit(0)
    })
  } else {
    console.log('Loading the configuration..')
    let { emojis: loadedEmojis } = require(resolvePath('../config/download.json'))
    emojis = loadedEmojis
    console.log(`${colors.magenta(Object.keys(emojis).length)} emoji(s) loaded!`)
  }

  const data = {}

  for (const emoji of Object.entries(emojis)) {
    const id = emoji[1]
    const rawName = emoji[0]
    let name = emoji[0]
    const url = `https://cdn.discordapp.com/emojis/${id.replace(/\D/g, '')}?size=256&quality=lossless`

    console.log(colors.white.bgWhite('------------------------------'))
    if (name.match(fileregex)) {
      name = name.replaceAll(fileregex, '')
      console.log(`${colors.magenta(rawName)} contains invalid characters, removing them..`)
    }

    console.log(`Downloading ${colors.magenta(rawName)}...`)

    await downloadImage(url, `./emojis/${name}`).then(filepath => {
      data[rawName] = filepath

      console.log(`Sucessfully downloaded ${colors.magenta(rawName)}.`)
    }).catch((error) => {
      console.log(`Failed to download ${colors.magenta(rawName)}.\nReason: ${colors.bgRed(error.message)}`)
    })
  }

  console.log(colors.white.bgWhite('------------------------------'))
  console.log(`${colors.magenta(Object.keys(data).length)} emoji(s) have been successfully downloaded!`)
  console.log(`${colors.magenta(Object.keys(emojis).length - Object.keys(data).length)} emoji(s) have failed to download!`)
  fs.writeFileSync('./results/download.json', JSON.stringify(data, null, 2))
}