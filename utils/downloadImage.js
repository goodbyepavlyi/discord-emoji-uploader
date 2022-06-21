/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs')
const path = require('path')
const axios = require('axios')

module.exports = (url, imagePath) => new Promise((resolve, reject) => {
  axios({ url, responseType: 'stream' }).then((response) => {
    const format = response.headers['content-type'].split('/')[1]
    const filePath = path.resolve(`${imagePath}.${format}`)

    response.data.pipe(fs.createWriteStream(filePath))
      .on('finish', () => resolve(filePath))
      .on('error', error => reject(error))
  }).catch(error => { throw error })
})