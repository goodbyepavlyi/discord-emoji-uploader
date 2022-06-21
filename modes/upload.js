/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs')
const path = require('path')
const readline = require("readline")
const colors = require('colors/safe')

/*
    *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')
const uploadEmoji = require('../utils/uploadEmoji')

async function upload(index, emoji, name, emojiName, size, image, currentGuild, token, emojis, data) {
    return new Promise((resolve, reject) => {
        uploadEmoji(emojiName, size, image, currentGuild, token).then(async (json) => {
            const { id, animated } = json

            if (emojis instanceof Array) emojis = emojis.filter(item => item !== emoji)
            else delete emojis[emoji]

            console.log(`${colors.magenta(name)} uploaded in ${colors.magenta(currentGuild)}!`)

            data[name] = `<${animated ? 'a' : ''}:${name}:${id}>`

            if (index == (emojis.length - 1)) {
                console.log(`All done`)
                return resolve()
            }

            if (index != (emojis.length - 1)) {
                return resolve()
            }
        }).catch(async (json) => {
            if (json.stack) return reject(json)

            const { code: errorCode, errors, message, retry_after: ratelimit } = json

            const errorMessages = [`${colors.bgRed('Discord API has returned an error!')}`]
            if (errorCode) errorMessages.push(`${colors.magenta('Error Code')} ${errorCode}`)
            if (message) errorMessages.push(`${colors.magenta('Message')} ${message}`)
            if (ratelimit) errorMessages.push(`${colors.magenta('Ratelimit')} ${Math.round(ratelimit / 60)} minutes (${ratelimit}ms)`)
            if (errors) Object.keys(errors).map(key => errors[key]._errors.map(error => errorMessages.push(error.message)))

            if (ratelimit)
                errorMessages.push(`You have been ratelimited in the ${colors.magenta(currentGuild)} guild!`)

            if (errorCode == 50013) errorMessages.push(`You do not have permissions to upload emojis in the ${colors.magenta(currentGuild)} guild!`)
            if (errorCode == 10004) errorMessages.push(`The guild with an ID ${colors.magenta(currentGuild)} does not exist!`)

            console.error(errorMessages.join('\n'))

            return reject({ errorCode, errors, message, ratelimit })
        })
    })
}

module.exports = async (arguments) => {
    console.log('Loading the configuration..')
    const { token } = require(resolvePath('../config/global.json'))
    const { guilds } = require(resolvePath('../config/upload.json'))
    console.log(`Configuration has been sucessfully loaded!`)

    const data = {}
    let guildId = 0
    let currentGuild = guilds[guildId]

    const downloadResultsExist = fs.existsSync(resolvePath('../results/download.json'))
    if (downloadResultsExist) {
        const { stdin, stdout } = process
        const rl = readline.createInterface({ input: stdin, output: stdout })

        function promptUser() {
            return new Promise((resolve, reject) => {
                const ask = () => rl.question(`There were results found for downloading files, would you like to use them? ${colors.magenta('[y/n]')} `, (answer) => {
                    const yes = answer == "y" || answer == "yes" || answer == "n" || answer == "no"
                    if (!yes) return ask()

                    rl.close()
                    resolve(answer, reject)
                })

                ask()
            })
        }

        const answer = await promptUser()
        const yes = answer == "yes" || answer == "y"
        if (yes) {
            let emojis = require(resolvePath('../results/download.json'))

            for (const [index, [rawName, filepath]] of Object.entries(Object.entries(emojis))) {
                const name = rawName.split('.')[0].replaceAll(/[/\s/\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\\'\"\|\~\`\_\-]/g, '_')
                const { size } = fs.statSync(filepath)
                const content = fs.readFileSync(filepath, { encoding: 'base64' })
                const extension = path.extname(resolvePath(filepath))
                const image = `data:image/${extension};base64,${content}`

                console.log(`${colors.white.bgWhite('------------------------------')}\nUploading ${colors.magenta(name)} to ${colors.magenta(currentGuild)}..`)

                await upload(index, filepath, rawName, name, size, image, currentGuild, token, emojis, data).then(() => { }).catch(async (error) => {
                    if (error.ratelimit) {
                        guildId++
                        if (!guilds[guildId]) {
                            fs.writeFileSync('./results/upload.json', JSON.stringify(data, null, 2))
                            return process.exit(0)
                        }
                        
                        currentGuild = guilds[guildId]
                    }

                    await upload(index, filepath, rawName, name, size, image, currentGuild, token, emojis, data).catch((error) => error)
                })
            }

            fs.writeFileSync('./results/upload.json', JSON.stringify(data, null, 2))
            return
        }
    }

    let emojis = fs.readdirSync('./emojis')
    if (emojis.length == 0) console.log('No emojis found!')

    for (const [index, emoji] of emojis.entries()) {
        const name = emoji.split('.')[0].replaceAll(/[/\s/\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\\'\"\|\~\`\_\-]/g, '_')
        const { size } = fs.statSync(`./emojis/${emoji}`)
        const content = fs.readFileSync(`./emojis/${emoji}`, { encoding: 'base64' })
        const extension = path.extname(resolvePath(`../emojis/${emoji}`))
        const image = `data:image/${extension};base64,${content}`

        console.log(`${colors.white.bgWhite('------------------------------')}\nUploading ${colors.magenta(emoji)} to ${colors.magenta(currentGuild)}..`)
        
        await upload(index, emoji, rawName, name, size, image, currentGuild, token, emojis, data).then(() => { }).catch(async (error) => {
            if (error.ratelimit) {
                guildId++
                if (!guilds[guildId]) {
                    fs.writeFileSync('./results/upload.json', JSON.stringify(data, null, 2))
                    return process.exit(0)
                }

                currentGuild = guilds[guildId]
            }

            await upload(index, emoji, rawName, name, size, image, currentGuild, token, emojis, data).catch((error) => error)
        })
    }

    fs.writeFileSync('./results/upload.json', JSON.stringify(data, null, 2))
}