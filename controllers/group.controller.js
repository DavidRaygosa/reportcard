'use strict'
var group = require('../models/group.model'); // Importa el modelo con mongoose
var auth = require('./auth.controller'); // Import and check if has a token (JWT)
var controller_group =
{
	getGroupByID: (req, res) => {
		if(auth(req)){
			let projectID = req.params.id;
			group.findById(projectID, (error, document) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (document.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ document });
			});
		} else res.status(401).send('Unauthorized');
	},
	addTeacher: (req, res) =>
	{
		if(auth(req)){
			let projectID = req.params.id;
			let projectDay = req.params.day;
			let teacher = req.body;
			if(projectDay == 'monday')
			{
				group.findByIdAndUpdate(projectID,{$push:{monday: teacher}},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
			if(projectDay == 'tuesday')
			{
				group.findByIdAndUpdate(projectID,{$push:{tuesday: teacher}},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
			if(projectDay == 'wednesday')
			{
				group.findByIdAndUpdate(projectID,{$push:{wednesday: teacher}},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
			if(projectDay == 'thursday')
			{
				group.findByIdAndUpdate(projectID,{$push:{thursday: teacher}},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
			if(projectDay == 'friday')
			{
				group.findByIdAndUpdate(projectID,{$push:{friday: teacher}},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
		} else res.status(401).send('Unauthorized');
	},
	updateGroup: (req, res) =>
	{
		if(auth(req)){
			var projectID = req.params.id;
			var update = req.body;
			group.findByIdAndUpdate(projectID, update, {new:true} ,(error, projectUpdated) =>
			{
				if(error) return res.status(500).send({message: 'Error Al Actualizar'});
				if(!projectUpdated) return res.status(404).send({message: 'No Existe El Proyecto'});
				return res.status(200).send({project: projectUpdated});
			});
		} else res.status(401).send('Unauthorized');
	},
	getGroups: (req, res) => {
		if(auth(req)){
			group.find({/*[EJ: year:2019]*/ }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	}
}
module.exports = controller_group;