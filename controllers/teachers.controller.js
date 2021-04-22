'use strict'
var teacher = require('../models/teacher.model'); // Importa el modelo con mongoose
var auth = require('./auth.controller'); // Import and check if has a token (JWT)
var controller_teacher =
{
	// New Teacher
	createTeacher: (req, res) => {
		if(auth(req)){
			var project = new teacher();
			let params = req.body;
			project.name = params.name;
			project.lastnamep = params.lastnamep;
			project.lastnamem = params.lastnamem;
			project.grade = params.grade;
			project.subjects = params.subjects;
			project.groups = params.groups;
			project.turn = params.turn;
			project.counselor = params.counselor;
			project.save((error, teacher) => {
				if (error) return res.status(500).send({ message: "Error Al Guardar" });
				if (!teacher) return res.status(404).send({ message: 'No Se Ha Podido Guardar El Documento' })
				return res.status(200).send({ message: teacher });
			});
		} else res.status(401).send('Unauthorized');
	},
	teacherRange: (req, res) => {
		if(auth(req)){
			let skip = parseInt(req.params.skip);
			teacher.find().skip(skip).limit(5).sort({ '_id': -1 }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	},
	getTeacherByID: (req, res) => {
		if(auth(req)){
			let projectID = req.params.id;
			teacher.findById(projectID, (error, document) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if(document != null) if (document.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ document });
			});
		} else res.status(401).send('Unauthorized');
	},
	getTeacherByLastname: (req, res) => {
		if(auth(req)){
			let projectLastname = req.params.lastname;
			teacher.find({ lastnamep: projectLastname/*[EJ: year:2019]*/ }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	},
	getTeacherByTurn: (req, res) => {
		if(auth(req)){
			let projectTurn = req.params.turn;
			teacher.find({$or:[{turn: projectTurn},{ turn: "AMBOS"}]}).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	},
	updateTeacher: (req, res) => {
		if(auth(req)){
			var projectID = req.params.id;
			var update = req.body;
			teacher.findByIdAndUpdate(projectID, update, { new: true }, (error, projectUpdated) => {
				if (error) return res.status(500).send({ message: 'Error Al Actualizar' });
				if (!projectUpdated) return res.status(404).send({ message: 'No Existe El Proyecto' });
				return res.status(200).send({ project: projectUpdated });
			});
		} else res.status(401).send('Unauthorized');
	},
	deleteTeacher: (req, res) => {
		if(auth(req)){
			let projectID = req.params.id;
			teacher.findByIdAndDelete(projectID, (error, projectDeleted) => {
				if (error) return res.status(500).send({ message: 'No Se Ha Podido Borrar El Proyecto' });
				if (!projectDeleted) return res.status(404).send({ message: 'No Se Puede Eliminar Ese Proyecto' });
				return res.status(200).send({ project: projectDeleted });
			});
		} else res.status(401).send('Unauthorized');
	},
	addGroup: (req, res) => {
		if(auth(req)){
			let projectID = req.params.id;
			let group = req.body;
			teacher.findByIdAndUpdate(projectID,{$push:{groups: group}},(error, projectUpdated) =>
			{
				if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
				if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
				return res.status(200).send({project: projectUpdated});
			});
		} else res.status(401).send('Unauthorized');
	},
	getTeachers: (req, res) => {
		if(auth(req)){
			teacher.find({/*[EJ: year:2019]*/ }).exec((error, documents) => {
				if (error) return res.status(500).send({ message: "Error Al Devolver Los Datos" });
				if (documents.length == 0) return res.status(200).send({ message: "No Hay Proyectos Para Mostrar" });
				return res.status(200).send({ documents });
			});
		} else res.status(401).send('Unauthorized');
	}
}
module.exports = controller_teacher;