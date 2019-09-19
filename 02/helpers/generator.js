const emoji = require('node-emoji');

const baseUrl = 'https://⭐️⭐️.ws/'

function r() {
    return emoji.random().emoji;
}

module.exports = () => { return `${baseUrl}${r()}${r()}${r()}${r()}${r()}` };