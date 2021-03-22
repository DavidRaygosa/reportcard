'use strict'

const nodemailer = require('nodemailer');
var ejs = require('ejs');

var controller_email = 
{
	
	sendEmail: (req, res) =>
	{
		let params = req.body;
		let transporter = nodemailer.createTransport({
		service: 'gmail',
		secure: true,
		auth: 
		{
			user: 'david.raygosa.mailer@gmail.com', // Cambialo por tu email
			pass: 'azullindo5' // Cambialo por tu password
			}
		});

		ejs.renderFile('./views/Email.ejs', { params }, function (err, data) 
		{
			if (err) 
			{
				console.log(err);
			} 
			else 
			{
				const mailOptions = 
				{
					from: 'Portfolio||David Raygosa',
					to: 'david.raygosa97@gmail.com', // Cambia esta parte por el destinatario
					subject: params.subject,
					html: data
				};
				transporter.sendMail(mailOptions, (err, info) =>
				{
					if(err) return res.status(200).send({message:'Error Al Enviar Correo'});
					else return res.status(200).send({message:'Correo Enviado'});
				});
			}
		});
	}
}

module.exports = controller_email;