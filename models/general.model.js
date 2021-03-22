'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = Schema(
	{
		teacherslenght: Number,
		counselorlenght: Number,
		documents_title: String
	});
module.exports = mongoose.model('general', ProjectSchema);