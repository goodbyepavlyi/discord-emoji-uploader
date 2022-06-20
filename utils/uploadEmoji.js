/*
    *IMPORTING NODE CLASSES
*/
const fetch = require('cross-fetch')

/**
 * @param {string} name 
 * @param {number} size 
 * @param {Buffer} image 
 * @param {number} guildId 
 * @param {string} token 
 * @returns {object} Discord API response
 */
module.exports = async (name, size, image, guildId, token) => new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/guilds/${guildId}/emojis`, {
        method: 'POST',
        headers: {
            'content-length': size,
            'content-type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({
            image,
            name 
        })
    }).then(async (response) => {
        return response.json()
    }).then(async (json) => {
        const { code, errors, message, retry_after } = json
        if (code || errors || message || retry_after) return reject(json)

        return resolve(json)
    }).catch((error) => {
        return reject(error)
    })
})