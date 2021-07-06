const express = require('express');
const router = express.Router();
const commiteeModel = require('../models/commiteeModel');

// tb_commmittee
router.post('/committee/create', commiteeModel.createCommitee);
router.put('/committee/update/:id', commiteeModel.editCommitee);
router.delete('/committee/delete/:id', commiteeModel.deleteCommitee);
router.get('/committees', commiteeModel.getAllCommitee);
router.get('/committee/:id', commiteeModel.getOneCommitee);
router.get('/committee/search', commiteeModel.searchCommitee);

// tb_committee_Detail

router.post('/committeeDetail/create', commiteeModel.createCommitteeDetail);
router.get('/committeeDetail/:id', commiteeModel.getSingleCommiteeDetail);
router.delete('/committeeDetail/delete', commiteeModel.deleteCommitteeDetail);



module.exports = router;