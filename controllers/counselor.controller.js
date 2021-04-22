'use strict'
var counselor = require('../models/counselor.model'); // Importa el modelo con mongoose
var auth = require('./auth.controller'); // Import and check if has a token (JWT)
var controller_counselor =
{
	// New Counselor
	getCounselors: (req, res) => {
		if(auth(req)){
			counselor.find({/*[EJ: year:2019]*/ }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	},
	getCounselorByID: (req, res) => {
		if(auth(req)){
			let projectID = req.params.id;
			counselor.findById(projectID, (error, document) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if(document != null) if (document.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ document });
			});
		} else res.status(401).send('Unauthorized');
	},
	createCounselor: (req, res) => {
		if(auth(req)){
			var project = new counselor();
			let params = req.body;
			project.name = params.name;
			project.lastnamep = params.lastnamep;
			project.lastnamem = params.lastnamem;
			project.grade = params.grade;
			project.turn = params.turn;
			project.save((error, counselor) => {
				if (error) return res.status(500).send({ message: "Error Al Guardar" });
				if (!counselor) return res.status(404).send({ message: 'No Se Ha Podido Guardar El Documento' })
				return res.status(200).send({ message: counselor });
			});
		} else res.status(401).send('Unauthorized');
	},
	counselorRange: (req, res) => {
		if(auth(req)){
			let skip = parseInt(req.params.skip);
			counselor.find().skip(skip).limit(5).sort({ '_id': -1 }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	},
	getCounselorByLastname: (req, res) => {
		if(auth(req)){
			let projectLastname = req.params.lastname;
			counselor.find({ lastnamep: projectLastname/*[EJ: year:2019]*/ }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	},
	updateCounselor: (req, res) => {
		if(auth(req)){
			var projectID = req.params.id;
			var update = req.body;
			counselor.findByIdAndUpdate(projectID, update, { new: true }, (error, projectUpdated) => {
				if (error) return res.status(500).send({ message: 'Error Al Actualizar' });
				if (!projectUpdated) return res.status(404).send({ message: 'No Existe El Proyecto' });
				return res.status(200).send({ project: projectUpdated });
			});
		} else res.status(401).send('Unauthorized');
	},
	deleteCounselor: (req, res) => {
		if(auth(req)){
			let projectID = req.params.id;
			counselor.findByIdAndDelete(projectID, (error, projectDeleted) => {
				if (error) return res.status(500).send({ message: 'No Se Ha Podido Borrar El Proyecto' });
				if (!projectDeleted) return res.status(404).send({ message: 'No Se Puede Eliminar Ese Proyecto' });
				return res.status(200).send({ project: projectDeleted });
			});
		} else res.status(401).send('Unauthorized');
	}
}
module.exports = controller_counselor;