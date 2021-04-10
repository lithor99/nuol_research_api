const express = require('express');
const router = express.Router();
const commiteeModel = require('../models/commiteeModel');

router.post('/add', commiteeModel.createCommitee);
router.put('/edit', commiteeModel.editCommitee);
router.delete('/delete', commiteeModel.deleteCommitee);
router.get('/getAll', commiteeModel.getAllCommitee);
router.get('/getOne', commiteeModel.getOneCommitee);
router.get('/search', commiteeModel.searchCommitee);

module.exports = router;