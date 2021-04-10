const express = require('express');
const router = express.Router();
const memberModel = require('../models/memberModel');
const verify = require('../jwt/jwt');

router.post('/add', memberModel.createMember);
router.put('/edit/username', memberModel.editUsername);
router.put('/edit/password', memberModel.editPassword);
router.get('/edit/banstate', memberModel.editBanState);
router.get('/delete', memberModel.deleteMember);
router.get('/getAll', memberModel.getAllMember);
// router.get('/getOne', facultyModel.getOneFaculty);
router.get('/search', memberModel.searchMember);
router.get('/login', verify, memberModel.memberLogin);
router.post('/upload', memberModel.uploadFile);
router.get('/file', memberModel.getFile);
// router.get('/download/:name', memberModel.downloadFile);

module.exports = router;