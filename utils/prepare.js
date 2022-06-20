/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs')

/*
    *IMPORTING FILES
*/
const resolvePath = require('../utils/resolvePath')

const configs = {
    global: {
        token: 'TOKEN',
    },
    download: {
        emojis: {
            emojiName: 'EMOJI_ID'
        }
    },
    upload: {
        guilds: [
            'GUILD_ID'
        ]
    },
    remove: {
        guildId: 'GUILD_ID',
        emojis: [
            'EMOJI_ID'
        ]
    },
    reset: {
        guilds: [
            'GUILD_ID'
        ]
    },
    list: {}
}

module.exports = (mode) => new Promise((resolve, reject) => {
    const folderExists = fs.existsSync(resolvePath('../config/'))
    if (!folderExists) fs.mkdirSync(resolvePath('../config/'), { recursive: true })

    const globalConfigExists = fs.existsSync(resolvePath(`../config/global.json`))
    if (!globalConfigExists) {
        fs.writeFileSync(resolvePath(`../config/global.json`), JSON.stringify(configs['global'], null, 2))
        reject(`The global configuration file was not found, re-creating a default one!`)
    }

    const configExists = fs.existsSync(resolvePath(`../config/${mode}.json`))
    if (!configExists) {
        fs.writeFileSync(resolvePath(`../config/${mode}.json`), JSON.stringify(configs[mode], null, 2))
        reject(`The configuration file was not found, re-creating a default one!`)
    }

    const emojiFolderExists = fs.existsSync(resolvePath('../emojis/'))
    if (!emojiFolderExists) fs.mkdirSync(resolvePath('../emojis/'), { recursive: true })
    
    const resultsFolderExists = fs.existsSync(resolvePath('../results/'))
    if (!resultsFolderExists) fs.mkdirSync(resolvePath('../results/'), { recursive: true })

    resolve()
})