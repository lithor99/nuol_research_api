const express = require('express');
const router = express.Router();
const commiteeModel = require('../models/commiteeModel');

router.post('/committee/create', commiteeModel.createCommitee);
router.put('/committee/update/:id', commiteeModel.editCommitee);
router.delete('/committee/delete/:id', commiteeModel.deleteCommitee);
router.get('/committees', commiteeModel.getAllCommitee);
router.get('/committee/:id', commiteeModel.getOneCommitee);
router.get('/committee/search', commiteeModel.searchCommitee);

module.exports = router;