/*
    *IMPORTING NODE CLASSES
*/
const colors = require('colors/safe')

/*
    *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')
const wait = require('../utils/wait')
const getEmojis = require('../utils/getEmojis')
const deleteEmoji = require('../utils/deleteEmoji')

module.exports = async (arguments) => {
    console.log('Loading the configuration..')
    const { token } = require(resolvePath('../config/global.json'))
    const { guilds } = require(resolvePath('../config/reset.json'))
    console.log(`Configuration has been sucessfully loaded!`)

    for (const guildId of guilds) {
        console.log(`Switching to guild ${colors.magenta(guildId)}!`)

        const emojis = await getEmojis(guildId, token).then((data) => data.map(({ id }) => id)).catch(({ code: errorCode, message, errors }) => {
            const errorMessages = [`${colors.bgRed('Discord API has returned an error!')}`]

            if (errorCode) errorMessages.push(`${colors.magenta('Error Code')} ${errorCode}`)
            if (message) errorMessages.push(`${colors.magenta('Message')} ${message}`)
            if (errors) Object.keys(errors).map(key => errors[key]._errors.map(error => errorMessages.push(error.message)))

            if (errorCode == 10004) errorMessages.push(`The provided Guild does not exist!`)
            if (errorCode == 50001) errorMessages.push(`To list emojis from a guild, you must be a member of that guild!`)
            
            console.error(errorMessages.join('\n'))
            return process.exit(0)
        })

        console.log(`${colors.magenta(emojis.length)} emoji(s) found!`)

        for (const emoji of emojis) {
            await deleteEmoji(emoji, guildId, token).then(async (response) => {
                if (response.status == 204) {
                    console.log(`Emoji with an ID ${colors.magenta(emoji)} has been sucessfully deleted from ${colors.magenta(guildId)}!`)
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
}