const express = require('express');
const router = express.Router();
const departmentModel = require('../models/departmentModel');

router.post('/add', departmentModel.createDepartment);
router.put('/edit', departmentModel.editDepartment);
router.delete('/delete', departmentModel.deleteDepartment);
router.get('/getAll', departmentModel.getAllDepartment);
router.get('/getOne', departmentModel.getOneDepartment);
router.get('/search', departmentModel.searchDepartment);

module.exports = router;