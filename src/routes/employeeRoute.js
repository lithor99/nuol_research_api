const express = require('express');
const router = express.Router();
const employeeModel = require('../models/employeeModel');
const token = require('../jwt/jwt');

router.post('/add', employeeModel.createEmployee);
router.put('/edit', employeeModel.editEmployee);
router.delete('/delete', employeeModel.deleteEmployee);
router.get('/getAll', employeeModel.getAllEmployee);
router.get('/getOne', employeeModel.getOneEmployee);
router.get('/search', employeeModel.searchEmployee);
router.get('/login',token,employeeModel.employeeLogin);

module.exports = router;