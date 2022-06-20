/*
    *IMPORTING NODE CLASSES
*/
const colors = require('colors/safe')

/*
    *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')
const downloadImage = require('../utils/downloadImage')
const getEmojis = require('../utils/getEmojis')

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

            if (errorCode) errorMessages.push(`${colors.bgGrey('Error Code')} ${errorCode}`)
            if (message) errorMessages.push(`${colors.bgGrey('Message')} ${message}`)
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
        console.log(`${colors.bgGrey(Object.keys(emojis).length)} emoji(s) loaded!`)
    }

    const stats = {
        success: 0,
        fails: 0
    }

    for (const emoji of Object.entries(emojis)) {
        const id = emoji[1]
        const name = emoji[0]
        const url = `https://cdn.discordapp.com/emojis/${id.replace(/\D/g, '')}?size=256&quality=lossless`

        console.log(colors.bgRed('------------------------------'))
        console.log(`Downloading ${name}...`)

        await downloadImage(url, `./emojis/${name}`).then(() => {
            stats.success++
            console.log(`Sucessfully downloaded ${colors.bgGrey(name)}.`)
        }).catch((error) => {
            stats.fails++
            console.log(`Failed to download ${colors.bgGrey(name)}.\nReason: ${colors.bgRed(error.message)}`)
        })
    }

    console.log(colors.bgRed('------------------------------'))
    console.log(`${colors.bgGrey(stats.success)} emoji(s) have been successfully downloaded!`)
    console.log(`${colors.bgGrey(stats.fails)} emoji(s) have failed to download!`)
}