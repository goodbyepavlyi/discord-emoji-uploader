/*
    *IMPORTING NODE CLASSES
*/
const colors = require('colors/safe')

/*
    *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')
const wait = require('../utils/wait')
const deleteEmoji = require('../utils/deleteEmoji')

module.exports = async (arguments) => {
    console.log('Loading the configuration..')
    const { token } = require(resolvePath('../config/global.json'))
    const { guildId, emojis } = require(resolvePath('../config/remove.json'))
    console.log(`Configuration has been sucessfully loaded!`)

    console.log(`${colors.magenta(emojis.length)} emoji(s) found!`)

    for (const emoji of emojis) {
        await deleteEmoji(emoji, guildId, token).then(async (response) => {
            if (response.status == 204) {
                console.log(`Emoji with an ID ${colors.magenta(emoji)} has been sucessfully deleted!`)
                await wait(500)
                return { message: undefined }
            }

            return response.json()
        }).then(async ({ errors, code, message, retry_after }) => {
            if (!message) return
            const errorMessages = [`${colors.bgRed('Discord API has returned an error!')}`]

            if (code) errorMessages.push(`${colors.magenta('Error Code')} ${code}`)
            if (message) errorMessages.push(`${colors.magenta('Message')} ${message}`)
            if (retry_after) errorMessages.push(`${colors.magenta('Ratelimit')} ${Math.floor(retry_after)} seconds`)
            if (errors) Object.keys(errors).map(key => errors[key]._errors.map(error => errorMessages.push(error.message)))

            console.error(errorMessages.join('\n'))

            await wait(retry_after * 1000)
            await deleteEmoji(emoji, guildId, token)
        }).catch((error) => console.error(error))
    }
}