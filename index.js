const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const Discord = require('discord.js');
const client = new Discord.Client();
var auth = require('./auth.json');

const headers = {
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4136"
    }
};

var client = new Discord.Client({
    token: auth.token,
    autorun: true
});

client.once('ready', () => {
	console.log('Ready!');
});

let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('timeout'))
        }, ms);
        promise.then(
            (res) => {
            clearTimeout(timeoutId);
            resolve(res);
        },
        (err) => {
            clearTimeout(timeoutId);
            reject(err);
        })
    })
}

client.on('message', async message => {
    try {
        if (message.content.substring(0, 8) === '!shopify') {
            
            let url = message.content.slice(9);
            
            await timeoutPromise(1000, fetch(`${url}.json`, headers))
                .then(response => response.json())
                .then(data => {
                    try {
                        var vars = "";

                        for (var i = 0; i < data['product']['variants'].length; i++) {
                            vars += `${data['product']['variants'][i]['title']} - ${data['product']['variants'][i]['id']}\n`;
                        }

                        message.channel.send(vars);
                    } catch (err) {
                        throw err;
                    }
                })
                .catch(() => {
                    message.channel.send('Site must be Shopify');
                });
        }
    } catch (err) {
        message.channel.send('Unexpected error');
    }
});