'use strict'

var post = require('../models/posts.model'); // Importa el modelo con mongoose
var fs = require('fs');
var path = require('path');

var controller_posts =
{
	// New Document
	createDocument: (req, res) =>
	{
		var project = new post();
		let params = req.body;

		project.title = params.title;
		project.subtitle = params.subtitle;
		project.message = params.message;
		project.transmition = params.transmition;
		project.comments = params.comments;
		project.publishedby = params.publishedby;
		project.publication_image = params.publication_image;
		project.publication_date = params.publication_date;
		project.images = params.images;

		project.save((error,DocumentStored) => 
		{
			if(error) return res.status(500).send({message: "Error Al Guardar"});
			if(!DocumentStored) return res.status(404).send({message:'No Se Ha Podido Guardar El Documento'})
			return res.status(200).send({message:DocumentStored});
		});
	},

	getDocuments: (req, res) =>
	{
		post.find({/*[EJ: year:2019]*/}).exec((error,documents) =>
		{
			if(error) return res.status(500).send({message: "Error Al Devolver Los Datos"});
			if(documents.length==0) return res.status(200).send({message: "No Hay Proyectos Para Mostrar"});
			return res.status(200).send({documents});
		});
	},

	getDocumentsRange: (req, res) =>
	{
		let skip = parseInt(req.params.skip);
		post.find().skip(skip).limit(5).sort({'_id': -1}).exec((error,documents) =>
		{
			if(error) return res.status(500).send({message: "Error Al Devolver Los Datos"});
			if(documents.length==0) return res.status(200).send({message: "No Hay Proyectos Para Mostrar"});
			return res.status(200).send({documents});
		});
	},

	getDocumentsRangeAdmin: (req, res) =>
	{
		let skip = parseInt(req.params.skip);
		post.find().skip(skip).limit(10).sort({'_id': -1}).exec((error,documents) =>
		{
			if(error) return res.status(500).send({message: "Error Al Devolver Los Datos"});
			if(documents.length==0) return res.status(200).send({message: "No Hay Proyectos Para Mostrar"});
			return res.status(200).send({documents});
		});
	},

	getDocument: (req, res) =>
	{
		var projectID = req.params.id;
		if(projectID == null) return res.status(404).send({message:'El Proyecto No Existe'});
		post.findById(projectID, (error, document) =>
		{
			if(error) return res.status(500).send({message: "Error Al Devolver Los Datos"});
			if(document.length==0) return res.status(200).send({message: "No Hay Proyectos Para Mostrar"});
			return res.status(200).send({document});
		});
	},

	getDocumentByTitle: (req, res) =>
	{
		let title = req.params.title;
		post.find({title:title/*[EJ: year:2019]*/}).exec((error,document) =>
		{
			if(error) return res.status(500).send({message: "Error Al Devolver Los Datos"});
			if(document.length==0) return res.status(200).send({message: "No Hay Proyectos Para Mostrar"});
			return res.status(200).send({document});
		});
	},

	addComment: (req, res) =>
	{
		let projectID = req.params.id;
		var comment = req.body;
		post.findByIdAndUpdate(projectID,{$push:{comments: comment}}, {new:true},(error, projectUpdated) =>
		{
			if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
			if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
			return res.status(200).send({project: projectUpdated});
		});
	},

	uploadImage: (req, res) =>
	{
		let projectID = req.params.id;
		let findName = 'Imagen No Subida...';
		// Entra A Files del API
		if(req.files)
		{
			// Obtener Nombre de la Imagen
			let filePath = req.files.image.path;
			let fileSplit = filePath.split('\\posts\\'); // Split Corta en 2 el texto, segun la condicion que pongas dentro del parentisis
			let fileName = fileSplit[1]; // 0 - Lado Izquierdo del corto, 1 - Lado derecho del Corte
			let extSplit = fileName.split('\.');
			let fileExt = extSplit[1];
			// Comprobar Extensino del Archivo
			if
			(
				fileExt=='png' || 
				fileExt == 'jpg' || 
				fileExt == 'jpeg' || 
				fileExt == 'gif' ||
				fileExt=='PNG' ||
				fileExt=='JPG' ||
				fileExt=='JPEG' ||
				fileExt=='GIF'
			)
			{
				// Subir Imagen
				post.findByIdAndUpdate(projectID,{publication_image:fileName}, {new:true},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
			else
			{
				fs.unlink(filePath, (error) =>
				{
					return res.status(200).send({message: 'La Extension No Es Valida'});
				});
			}
		}
		else
		{
			return res.status(200).send({message: findName});
		}
	},

	uploadImages: (req, res) =>
	{
		let projectID = req.params.id;
		let findName = 'Imagen No Subida...';
		// Entra A Files del API
		if(req.files)
		{
			// Obtener Nombre de la Imagen
			let filePath = req.files.images.path;
			let fileSplit = filePath.split('\\posts\\'); // Split Corta en 2 el texto, segun la condicion que pongas dentro del parentisis
			let fileName = fileSplit[1]; // 0 - Lado Izquierdo del corto, 1 - Lado derecho del Corte
			let extSplit = fileName.split('\.');
			let fileExt = extSplit[1];
			// Comprobar Extensino del Archivo
			if
			(
				fileExt=='png' || 
				fileExt == 'jpg' || 
				fileExt == 'jpeg' || 
				fileExt == 'gif' ||
				fileExt=='PNG' ||
				fileExt=='JPG' ||
				fileExt=='JPEG' ||
				fileExt=='GIF'
			)
			{
				// Subir Imagen
				post.findByIdAndUpdate(projectID,{$push:{images: fileName}}, {new:true},(error, projectUpdated) =>
				{
					if(error) return res.status(500).send({message: 'La Imagen No Se Ha Subido'});
					if(!projectUpdated) return res.status(404).send({message: 'El Documento No Existe'});
					return res.status(200).send({project: projectUpdated});
				});
			}
			else
			{
				fs.unlink(filePath, (error) =>
				{
					return res.status(200).send({message: 'La Extension No Es Valida'});
				});
			}
		}
		else
		{
			return res.status(200).send({message: findName});
		}
	},

	getImagePostsFile: (req, res) =>
	{
		let file = req.params.image;
		let path_file = './uploads/posts/'+file;

		fs.exists(path_file, (exists) =>
		{
			if(exists) return res.sendFile(path.resolve(path_file));
			else return res.status(200).send({message: 'No Existe La Imagen'});
		});
	},

	deleteImage: (req, res) =>
	{
		let fileName = req.params.image;
		fs.unlink('./uploads/posts/'+fileName, (err) => {});
	},

	deleteImages: (req, res) =>
	{
		let projectID = req.params.id;
		let fileName = req.params.image;
		post.findByIdAndUpdate(projectID, {$pull:{images: fileName}}, {new:true} ,(error, projectUpdated) =>
		{
			if(error) return res.status(500).send({message: 'Error Al Actualizar'});
			if(!projectUpdated) return res.status(404).send({message: 'No Existe El Proyecto'})
			fs.unlink('./uploads/posts/'+fileName, (err) => {});
			return res.status(200).send({project: projectUpdated});
		});
	},

	updatePost: (req, res) =>
	{
		var projectID = req.params.id;
		var update = req.body;
		post.findByIdAndUpdate(projectID, update, {new:true} ,(error, projectUpdated) =>
		{
			if(error) return res.status(500).send({message: 'Error Al Actualizar'});
			if(!projectUpdated) return res.status(404).send({message: 'No Existe El Proyecto'});
			return res.status(200).send({project: projectUpdated});
		});
	},

	deleteProject: (req, res) =>
	{
		var projectID = req.params.id;
		post.findByIdAndDelete(projectID, (error, projectDeleted) =>
		{
			if(error) return res.status(500).send({message: 'No Se Ha Podido Borrar El Proyecto'});
			if(!projectDeleted) return res.status(404).send({message: 'No Se Puede Eliminar Ese Proyecto'});
			return res.status(200).send({project: projectDeleted});
		});
	}
}

module.exports = controller_posts;