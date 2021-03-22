'use strict'
var logos = require('../models/logos.model'); // Importa el modelo con mongoose
var fs = require('fs');
var path = require('path');
var controller_logos =
{
	updateLogo: (req, res) => {
		var projectID = req.params.id;
		var update = req.body;
		logos.findByIdAndUpdate(projectID, update, { new: true }, (error, projectUpdated) => {
			if (error) return res.status(500).send({ message: 'Error Al Actualizar' });
			if (!projectUpdated) return res.status(404).send({ message: 'No Existe El Proyecto' });
			return res.status(200).send({ project: projectUpdated });
		});
	},
	getLogos: (req, res) => {
		logos.find({/*[EJ: year:2019]*/ }).exec((error, documents) => {
			if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
			if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
			return res.status(200).send({ documents });
		});
	}
}
module.exports = controller_logos;