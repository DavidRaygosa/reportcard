'use strict'
var user = require('../models/user.model'); // Importa el modelo con mongoose
var auth = require('./auth.controller'); // Import and check if has a token (JWT)
var jwt = require('jsonwebtoken')
var controller_user =
{
	getUser: (req, res) => {
		if(auth(req)){
			let username = req.params.user;
			user.find({ user: username/*[EJ: year:2019]*/ }).exec((error, user) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (user.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ user });
			});
		} else res.status(401).send('Unauthorized');
	},
	login: (req, res) => {
		let username = req.body.user
		let password = req.body.password
		user.find({ user: username/*[EJ: year:2019]*/ }).exec((error, user) => {
			if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
			if (user.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
			// VALIDATION
			if(username == user[0].user && password == user[0].password){
			// JSON WEB TOKEN (JWT)
			let tokenData = {
				user: username
			}
			var token = jwt.sign(tokenData, 'Secret Password', {
				expiresIn: 60 * 60 * 24 // expires in 24 hours
			 })
			return res.status(200).send({ token });
			}
			// VALIDATION FAILED
			return res.status(200).send({ message: "Invalid Validation" });
		});
	}
}
module.exports = controller_user;