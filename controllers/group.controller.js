'use strict'
var group = require('../models/group.model'); // Importa el modelo con mongoose
var fs = require('fs');
var path = require('path');
var controller_group =
{
	getGroupByID: (req, res) => {
		let projectID = req.params.id;
		group.findById(projectID, (error, document) => {
			if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
			if (document.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
			return res.status(200).send({ document });
		});
	},
	addTeacher: (req, res) =>
	{
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
	},
	updateGroup: (req, res) =>
	{
		var projectID = req.params.id;
		var update = req.body;
		group.findByIdAndUpdate(projectID, update, {new:true} ,(error, projectUpdated) =>
		{
			if(error) return res.status(500).send({message: 'Error Al Actualizar'});
			if(!projectUpdated) return res.status(404).send({message: 'No Existe El Proyecto'});
			return res.status(200).send({project: projectUpdated});
		});
	},
	getGroups: (req, res) => {
		group.find({/*[EJ: year:2019]*/ }).exec((error, documents) => {
			if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
			if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
			return res.status(200).send({ documents });
		});
	}
}
module.exports = controller_group;