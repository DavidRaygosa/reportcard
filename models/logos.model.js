'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = Schema(
	{
		name: String,
		base64: String
	});
module.exports = mongoose.model('logos', ProjectSchema);
// projects --> guarda los documentos en la coleccion	