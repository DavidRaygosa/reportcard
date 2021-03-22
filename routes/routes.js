'use strict'

var express = require('express');

// Controllers

var GeneralController = require('../controllers/general.controller');
var UserController = require('../controllers/users.controller');
var TeacherController = require('../controllers/teachers.controller');
var CounselorController = require('../controllers/counselor.controller');
var GroupController = require('../controllers/group.controller');
var LogosController = require('../controllers/logos.controller');
var GeneralHourController = require('../controllers/generalhor.controller');
var router = express.Router();

// MiddleWare

var multipart = require('connect-multiparty');
var multipartMiddleWare = multipart({uploadDir: './uploads'});

// Routes

	// General
		router.post('/new-general', GeneralController.createDocument);
		router.get('/get-general', GeneralController.getDocuments);
		router.put('/update-general/:id',GeneralController.updateGeneral);

	// Users
		router.get('/get-user/:user?', UserController.getUser); //*******/

	// Teachers
		router.post('/create-teacher', TeacherController.createTeacher);
		router.get('/get-teachersrangeadmin/:skip?', TeacherController.teacherRange);
		router.get('/get-teacher/:id?', TeacherController.getTeacherByID);
		router.get('/get-teacherbylastname/:lastname?', TeacherController.getTeacherByLastname);
		router.get('/get-teacherbyturn/:turn?', TeacherController.getTeacherByTurn);
		router.delete('/delete-teacher/:id',TeacherController.deleteTeacher);
		router.put('/update-teacher/:id',TeacherController.updateTeacher);
		router.put('/add-group/:id?', TeacherController.addGroup);
		router.get('/get-teachers', TeacherController.getTeachers);

	// Counselor
		router.get('/get-counselor', CounselorController.getCounselors);
		router.get('/get-counselor/:id?', CounselorController.getCounselorByID);
		router.post('/create-counselor', CounselorController.createCounselor);
		router.get('/get-counselorsrangeadmin/:skip?', CounselorController.counselorRange);
		router.get('/get-counselor/:id?', CounselorController.getCounselorByID);
		router.get('/get-counselorbylastname/:lastname?', CounselorController.getCounselorByLastname);
		router.delete('/delete-counselor/:id',CounselorController.deleteCounselor);
		router.put('/update-counselor/:id',CounselorController.updateCounselor);

	// Groups
		router.get('/get-group/:id?', GroupController.getGroupByID);
		router.put('/add-teacher/:id?/:day?', GroupController.addTeacher);
		router.put('/update-group/:id',GroupController.updateGroup);
		router.get('/get-groups', GroupController.getGroups);

	// Logos
	router.put('/update-logo/:id',LogosController.updateLogo);
	router.get('/get-logos', LogosController.getLogos);

	// GENERAL HOURS
		router.post('/create-general', multipartMiddleWare, GeneralHourController.generateExcel);
		router.get('/download-file/:fileName?/:isPDF?', GeneralHourController.getFile);
		
module.exports = router;