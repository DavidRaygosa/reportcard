'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = Schema(
	{
		user: String,
		password: String
	});
module.exports = mongoose.model('users', ProjectSchema);
// projects --> guarda los documentos en la coleccion	