/*
    *IMPORTING NODE CLASSES
*/
const colors = require('colors/safe')

/*
    *IMPORTING FILES
*/
const { version } = require('./package.json');
const prepare = require('./utils/prepare')

const modes = [
    'download',
    'upload',
    'remove',
    'reset',
    'list',
]
const mode = process.argv[2]
if (!modes.includes(mode) || mode == 'help') {
    console.log(colors.magenta('██╗  ██╗███████╗██╗     ██╗      ██████╗     ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗'))
    console.log(colors.magenta('██║  ██║██╔════╝██║     ██║     ██╔═══██╗    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗██║'))
    console.log(colors.magenta('███████║█████╗  ██║     ██║     ██║   ██║    ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║██║'))
    console.log(colors.magenta('██╔══██║██╔══╝  ██║     ██║     ██║   ██║    ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║╚═╝'))
    console.log(colors.magenta('██║  ██║███████╗███████╗███████╗╚██████╔╝    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝██╗'))
    console.log(colors.magenta('╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝      ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝'))
    console.log('')
    console.log(` • Version: ${colors.magenta(version)}`)
    console.log(` • Author: ${colors.magenta('goodbyepavlyi')}`)
    console.log('')
    console.log(`There are five modes in the application: ${colors.magenta('DOWNLOAD')}, ${colors.magenta('UPLOAD')}, ${colors.magenta('REMOVE')}, ${colors.magenta('RESET')} and ${colors.magenta('LIST')}.`)
    console.log('')
    console.log(colors.bold.magenta('USAGE:'))
    console.log(`${colors.magenta('<>')} required, ${colors.magenta('[]')} optional`)
    console.log(`${colors.bold.magenta('DOWNLOAD')}: npm run download [guildId]`)
    console.log(`${colors.bold.magenta('UPLOAD')}: npm run upload`)
    console.log(`${colors.bold.magenta('REMOVE')}: npm run remove`)
    console.log(`${colors.bold.magenta('RESET')}: npm run reset`)
    console.log(`${colors.bold.magenta('LIST')}: npm run list <guildId>`)
    console.log('')
    
    return
}

console.log(`Checking for any missing files..`)
prepare(mode).then(() => {
    console.log(`Starting using the ${colors.magenta(mode.toUpperCase())} mode!\n${colors.white.bgWhite('------------------------------')}`)
    const arguments = process.argv.splice(3)
    require(`./modes/${mode.toLowerCase()}`)(arguments)
}).catch(error => {
    console.error(colors.bgRed(error))
})