/*
    *IMPORTING NODE CLASSES
*/
const fetch = require('cross-fetch')

/**
 * @param {number} emojiId 
 * @param {number} guildId 
 * @param {string} token 
 * @returns {object} Discord API response
 */
module.exports = (guildId, token) => new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/guilds/${guildId}/emojis`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': token,
        }
    }).then(async (response) => {
        return response.json()
    }).then(async (json) => {
        const { code, errors, message, retry_after } = json
        if (code || errors || message || retry_after) return reject(json)

        return resolve(json)
    }).catch(error => {
        return reject(error)
    })
})