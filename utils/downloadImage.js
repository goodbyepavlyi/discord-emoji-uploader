/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs')
const axios = require('axios')

module.exports = (url, imagePath) => axios({ url, responseType: 'stream' }).then((response) =>{    
    new Promise((resolve, reject) => {
        const format = response.headers['content-type'].split('/')[1]
        response.data.pipe(fs.createWriteStream(`${imagePath}.${format}`))
            .on('finish', () => resolve())
            .on('error', error => reject(error))
    })},
).catch(error => { throw error })