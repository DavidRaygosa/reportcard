'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProjectSchema = Schema(
	{
		gen: String,
		group: String,
		turn: String,
		monday:
		[{
			hour: String,
			teacher_id: String,
			subject: String
		}],
		tuesday:
		[{
			hour: String,
			teacher_id: String,
			subject: String
		}],
		wednesday:
		[{
			hour: String,
			teacher_id: String,
			subject: String
		}],
		thursday:
		[{
			hour: String,
			teacher_id: String,
			subject: String
		}],
		friday:
		[{
			hour: String,
			teacher_id: String,
			subject: String
		}],
		counselor: String
	});
module.exports = mongoose.model('groups', ProjectSchema);
// projects --> guarda los documentos en la coleccion	