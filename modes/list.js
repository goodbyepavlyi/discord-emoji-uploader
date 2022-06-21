/*
    *IMPORTING NODE CLASSES
*/
const colors = require('colors/safe')

/*
    *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')
const getEmojis = require('../utils/getEmojis')

module.exports = async (arguments) => {
    console.log('Loading the configuration..')
    const { token } = require(resolvePath('../config/global.json'))
    console.log(`Configuration has been sucessfully loaded!`)

    const guildId = arguments[0]
    if (!guildId) return console.log('You need to provide a Guild ID')

    await getEmojis(guildId, token).then((data) => {
        console.log(data.map(({ name, id, animated }) => {
            const code = `<${animated ? 'a' : ''}:${name}:${id}>`
            return `${colors.magenta('Name:')} ${name} ${colors.magenta('ID:')} ${id} ${colors.magenta('Code:')} ${code}`
        }).join(`\n`))
        console.log(`${colors.magenta(data.length)} emoji(s) found!`)
    }).catch(({ code: errorCode, message, errors }) => {
        const errorMessages = [`${colors.bgRed('Discord API has returned an error!')}`]

        if (errorCode) errorMessages.push(`${colors.magenta('Error Code')} ${errorCode}`)
        if (message) errorMessages.push(`${colors.magenta('Message')} ${message}`)
        if (errors) Object.keys(errors).map(key => errors[key]._errors.map(error => errorMessages.push(error.message)))

        if (errorCode == 10004) errorMessages.push(`The provided Guild does not exist!`)
        if (errorCode == 50001) errorMessages.push(`To list emojis from a guild, you must be a member of that guild!`)
        
        console.error(errorMessages.join('\n'))
    })
}