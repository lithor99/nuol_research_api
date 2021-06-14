const express = require('express');
const router = express.Router();
const employeeModel = require('../models/employeeModel');
const token = require('../jwt/jwt');

router.post('/employee/create', employeeModel.createEmployee);
router.put('/employee/update/:id', employeeModel.editEmployee);
router.delete('/employee/delete/:id', employeeModel.deleteEmployee);
router.get('/employees', employeeModel.getAllEmployee);
router.get('/employeees', employeeModel.getEmployeesPagination);
router.get('/employee/:id', employeeModel.getOneEmployee);
router.get('/employee/search', employeeModel.searchEmployee);
// router.post('/employee/login', token, employeeModel.employeeLogin);
router.post('/employee/login', employeeModel.employeeLogin);

module.exports = router;