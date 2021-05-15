const express = require('express');
const router = express.Router();
const employeeModel = require('../models/employeeModel');
const verify = require('../jwt/jwt');

router.post('/employee/create', employeeModel.createEmployee);
router.put('/employee/update/:id', employeeModel.editEmployee);
router.delete('/employee/delete/:id', employeeModel.deleteEmployee);
router.get('/employees', employeeModel.getAllEmployee);
router.get('/employee/:id', employeeModel.getOneEmployee);
router.get('/employee/search', employeeModel.searchEmployee);
router.get('/employee/login', verify, employeeModel.employeeLogin);

module.exports = router;