const express = require('express');
const router = express.Router();
const facultyModel = require('../models/facultyModel');

router.post('/faculty/create', facultyModel.createFaculty);
router.put('/faculty/update/:id', facultyModel.editFaculty);
router.delete('/faculty/delete/:id', facultyModel.deleteFaculty);
router.get('/facultys', facultyModel.getAllFaculty);
router.get('/faculty/:id', facultyModel.getOneFaculty);
router.get('/faculty/search/:faculty_name', facultyModel.searchFaculty);
router.get('/faculty/pagination/page=:page_Id&limit=:limit_Id', facultyModel.pagination)

module.exports = router;