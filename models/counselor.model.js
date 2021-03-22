'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = Schema(
	{
		name: String,
		lastnamep: String,
		lastnamem: String,
		grade: String,
		turn: String
	});
module.exports = mongoose.model('counselors', ProjectSchema);
// projects --> guarda los documentos en la coleccion	