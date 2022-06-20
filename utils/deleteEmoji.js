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
module.exports = (emojiId, guildId, token) => new Promise((resolve, reject) => {
    fetch(`https://discord.com/api/v9/guilds/${guildId}/emojis/${emojiId}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': token,
        }
    }).then(response => {
        return resolve(response)
    }).catch(error => {
        return reject(error)
    })
})