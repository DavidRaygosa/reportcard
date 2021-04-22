'use strict'
var auth = require('./auth.controller'); // Import and check if has a token (JWT)
const webpush = require('web-push'); // IMPORT WEBPUSH
var fs = require('fs');
const path = require('path');

const vapidKeys = {
    "publicKey":"BCsfxp91Jw3WDbuzIY0PyYYC6rugUyHP5PdKqEYpmF3xlZPDqscJgVjg-8H-Te_fOMCzc3dPXp855IHNMEG2kEw",
    "privateKey":"TMHkDcb9Tdlccb47Xg4ZuV_LDJESfebk9WilfS78U3w"
}

webpush.setVapidDetails(
    'mailto:david.raygosa97@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var push_controller =
{
	// New Document
	savePush: (req, res) => {
		if(auth(req)){
            let name = Math.floor(Date.now()/1000);
			let tokenBrowser = req.body;
            let data = JSON.stringify(tokenBrowser, null, 2);
            fs.writeFile(`./tokens/token-${name}`,data, (err) =>{
                if(err) throw err;
                return res.status(200).send({data: `Save success`});
            })
		} else res.status(401).send('Unauthorized');
	},
    sendPush: (req, res) => {
		if(auth(req)){
			let payload = {
                "notification":{
                    "title": "¡Aplicacion Actualizada!",
                    "body": "Checa las ultimas mejoras",
                    "vibrate": [100,50,100],
                    "image": "./favicon.png",
                    "actions":[{
                        "action": "explore",
                        "title": "Ver actualización"
                    }]
                }
            }
            let directoryPath = './tokens'
            fs.readdir(directoryPath, (err, files) =>{
                if(err) return res.status(500).send({data: err});
                files.forEach((file, idx, array) =>{
                    if (idx === array.length - 1){ 
                        let tokenRaw = fs.readFileSync(`${directoryPath}/${file}`);
                        let tokenParse = JSON.parse(tokenRaw);
                        webpush.sendNotification(
                            tokenParse,
                            JSON.stringify(payload))
                            .then(response =>{
                                let path = directoryPath+'/'+file;
                                fs.unlink(path, (error) => { });
                            }).catch(err =>{
                                console.log(err);
                            });
                    }
                })
            });
            return res.status(200).send({data: `Send success`});
		} else res.status(401).send('Unauthorized');
	}
}
module.exports = push_controller;