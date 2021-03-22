'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = Schema(
	{
		name: String,
		lastnamep: String,
		lastnamem: String,
		grade: String,
		turn: String,
		subjects: Array,
		groups:
			[{
				day: String,
				hour: String,
				id_group: String,
				subject: String,
				turn: String
			}]
	});
module.exports = mongoose.model('teachers', ProjectSchema);
// projects --> guarda los documentos en la coleccion	