const express = require('express');
const router = express.Router();
const departmentModel = require('../models/departmentModel');

router.post('/department/create', departmentModel.createDepartment);
router.put('/department/update/:id', departmentModel.editDepartment);
router.delete('/department/delete/:id', departmentModel.deleteDepartment);
router.get('/departments', departmentModel.getAllDepartment);
router.get('/department/:id', departmentModel.getOneDepartment);
router.get('/department/search', departmentModel.searchDepartment);

module.exports = router;