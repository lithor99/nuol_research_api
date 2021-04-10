const express = require('express');
const router = express.Router();
const facultyModel = require('../models/facultyModel');

router.post('/add', facultyModel.createFaculty);
router.put('/edit', facultyModel.editFaculty);
router.delete('/delete', facultyModel.deleteFaculty);
router.get('/getAll', facultyModel.getAllFaculty);
router.get('/getOne', facultyModel.getOneFaculty);
router.get('/search', facultyModel.searchFaculty);

module.exports = router;