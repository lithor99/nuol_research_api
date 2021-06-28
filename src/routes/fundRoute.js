
const express = require('express');
const router = express.Router();
const fundModel = require('../models/fundModel');

router.post('/fund/create', fundModel.createFund);
router.put('/fund/update/:id', fundModel.editFund);
router.delete('/fund/delete/:id', fundModel.deleteFund);
router.get('/funds', fundModel.getAllFund);
router.get('/fund/:id', fundModel.getOneFund);
router.get('/fundById/:id', fundModel.getFundById);

module.exports = router;