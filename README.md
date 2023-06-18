<h1 align='center'>Discord Emoji Uploader</h1>

## Getting Started
First, run the application:
```bash
$ npm run help
██╗  ██╗███████╗██╗     ██╗      ██████╗     ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗
██║  ██║██╔════╝██║     ██║     ██╔═══██╗    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗██║
███████║█████╗  ██║     ██║     ██║   ██║    ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║██║
██╔══██║██╔══╝  ██║     ██║     ██║   ██║    ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║╚═╝
██║  ██║███████╗███████╗███████╗╚██████╔╝    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝██╗
╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝      ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝

There are five modes in the application: DOWNLOAD, UPLOAD, REMOVE, RESET and LIST.

USAGE:
<> required, [] optional
DOWNLOAD: npm run download [guildId]
UPLOAD: npm run upload
REMOVE: npm run remove
RESET: npm run reset
LIST: npm run list <guildId>
```

## Download Mode
This feature downloads all emojis from guild or from the configuration file.

**Sample Configuration**
```js
{
  emojis: {
    nodejs: '<:nodejs:988427909423304754>',
    express: '<:express:988420193174847589>',
    nextjs: '<:nextjs:988427782956662824>',
    react: '<:react:988420236044800010>'
  }
}
```

## Upload Mode
The emojis will be gradually uploaded to provided guilds through this feature.

**Sample Configuration**
```js
{
  guilds: [
    '978231278287585300',
    '988420236044800010',
    '988427891358466118'
  ]
}
```

## Remove Mode
Deletes emojis from the guild that have been defined in the configuration.

**Sample Configuration**
```js
{
  guildId: '978231278287585300',
  emojis: [
    '988427909423304754',
    '988427782956662824',
    '988420193174847589',
    '988420236044800010',
  ]
}
```

## Reset Mode
Deletes every emoji from the guilds that have been defined in the configuration.

**Sample Configuration**
```js
{
  guilds: [
    '988420193174847589',
    '988420236044800010',
    '988427782956662824',
    '988427909423304754',
  ]
}
```

## List Mode
Provides a list of all available emojis in a guild.

**Sample Output**
```js
$ npm run list guildId
Name: soontm ID: 406202191544582149 Code: <:soontm:406202191544582149>
Name: loading ID: 409494251228102666 Code: <a:loading:409494251228102666>
Name: pikaCHU ID: 409495010522824707 Code: <a:pikaCHU:409495010522824707>
Name: ban ID: 428630397459365898 Code: <a:ban:428630397459365898>
Name: dance ID: 429336765933813781 Code: <a:dance:429336765933813781>
Name: nou ID: 456284812718899200 Code: <:nou:456284812718899200>
Name: ping ID: 464520626594381854 Code: <:ping:464520626594381854>
Name: lttog ID: 472235614243127306 Code: <:lttog:472235614243127306>
Name: happy ID: 475190125173932032 Code: <:happy:475190125173932032>
Name: wobble ID: 494229933078478858 Code: <a:wobble:494229933078478858>
Name: dab ID: 523766340251680781 Code: <a:dab:523766340251680781>
```
