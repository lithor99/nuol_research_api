const express = require('express');
const router = express.Router();
const memberModel = require('../models/memberModel');
const token = require('../jwt/jwt');

router.post('/register', memberModel.memberRegist);
router.post('/confirm_register', token, memberModel.createMember);
router.put('/send_mail_again', memberModel.sendMailAgain);
router.post('/login', token, memberModel.memberLogin);
router.put('/forgot_password',memberModel.forgotPassword);
router.put('/confirm_email', memberModel.confirmEmailWhenForgotPassword);
router.put('/edit/username', memberModel.editMemberUsername);
router.put('/edit/password', memberModel.editMemberPassword);
router.post('/get_member_user', memberModel.getMemberUser);



router.put('/edit/banstate', memberModel.editBanState);
router.get('/delete', memberModel.deleteMember);
router.get('/get', memberModel.getAllMember);
router.get('/search', memberModel.searchMember);

module.exports = router;