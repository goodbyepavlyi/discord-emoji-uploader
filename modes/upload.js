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
const uploadEmoji = require('../utils/uploadEmoji')

module.exports = async (arguments) => {
    console.log('Loading the configuration..')
    const { token } = require(resolvePath('../config/global.json'))
    const { guilds } = require(resolvePath('../config/upload.json'))
    console.log(`Configuration has been sucessfully loaded!`)

    async function upload(index, emoji, name, size, image, currentGuild, token) {
        return new Promise((resolve, reject) => {
            uploadEmoji(name, size, image, currentGuild, token).then(async (json) => {
                const { name, id, animated } = json
    
                emojis = emojis.filter(item => item !== emoji)
    
                console.log(`${colors.bgGrey(emoji)} uploaded in ${colors.bgGrey(currentGuild)}!`)
    
                if (!data[currentGuild]) data[currentGuild] = {}
                data[currentGuild][name] = `<${animated ? 'a' : ''}:${name}:${id}>`
    
                if (index == (emojis.length-1)) {
                    console.log(`All done`)
                    return resolve()
                }
    
                if (index != (emojis.length-1)) {
                    return resolve()
                }
            }).catch(async (json) => {
                if (json.stack) return reject(json)

                const { code: errorCode, errors, message, retry_after: ratelimit } = json
    
                const errorMessages = [`${colors.bgRed('Discord API has returned an error!')}`]
                if (errorCode) errorMessages.push(`${colors.bgGrey('Error Code')} ${errorCode}`)
                if (message) errorMessages.push(`${colors.bgGrey('Message')} ${message}`)
                if (ratelimit) errorMessages.push(`${colors.bgGrey('Ratelimit')} ${Math.round(ratelimit / 60)} minutes (${ratelimit}ms)`)
                if (errors) Object.keys(errors).map(key => errors[key]._errors.map(error => errorMessages.push(error.message)))
                
                if (ratelimit)
                    errorMessages.push(`You have been ratelimited in the ${colors.bgGrey(currentGuild)} guild!`)
    
                if (errorCode == 50013) errorMessages.push(`You do not have permissions to upload emojis in the ${colors.bgGrey(currentGuild)} guild!`)
                if (errorCode == 10004) errorMessages.push(`The guild with an ID ${colors.bgGrey(currentGuild)} does not exist!`)
    
                console.error(errorMessages.join('\n'))

                return reject({ errorCode, errors, message, ratelimit })
            })
        })
    }

    const data = {}
    let emojis = fs.readdirSync('./emojis')
    if (emojis.length == 0) console.log('No emojis found!')

    let guildId = 0
    let currentGuild = guilds[guildId]

    for (const [index, emoji] of emojis.entries()) {
        const name = emoji.split('.')[0].replaceAll(/[/\s/\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g, '_')
        const { size } = fs.statSync(`./emojis/${emoji}`)
        const content = fs.readFileSync(`./emojis/${emoji}`, { encoding: 'base64' })
        const extension = path.extname(resolvePath(`../emojis/${emoji}`))
        const image = `data:image/${extension};base64,${content}`
        
        console.log(`${colors.bgRed('------------------------------')}\nUploading ${colors.bgGrey(emoji)} to ${colors.bgGrey(currentGuild)}..`)

        await upload(index, emoji, name, size, image, currentGuild, token).then(() => {}).catch(async (error) => {
            if (error.ratelimit) {
                guildId++
                if (!guilds[guildId]) guildId = 0
                currentGuild = guilds[guildId]
            }

            await upload(index, emoji, name, size, image, currentGuild, token).catch((error) => error)
        })
    }

    fs.writeFileSync('./results/upload.json', JSON.stringify(data, null, 2))
}