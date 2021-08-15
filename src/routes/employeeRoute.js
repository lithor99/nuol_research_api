const express = require('express');
const router = express.Router();
const employeeModel = require('../models/employeeModel');

router.post('/employee/create', employeeModel.createEmployee);
router.put('/employee/update/:id', employeeModel.editEmployee);
router.delete('/employee/delete/:id', employeeModel.deleteEmployee);
router.get('/employees', employeeModel.getAllEmployee);
router.get('/employee/:id', employeeModel.getOneEmployee);
router.get('/employee/search', employeeModel.searchEmployee);
router.post('/createSignUp', employeeModel.employeeSignUp);
router.post('/employee/login', employeeModel.employeeLogin);
router.put('/employee/forgot_Password', employeeModel.forgotPasswordEmployee);




module.exports = router;