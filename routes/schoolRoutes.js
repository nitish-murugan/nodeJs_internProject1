const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.post('/addSchool', schoolController.addSchool);

router.get('/listSchools', schoolController.listSchools);

router.get('/schools', schoolController.getAllSchools);

router.get('/schools/:id', schoolController.getSchoolById);

module.exports = router;
