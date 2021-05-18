const express = require('express');
const router = express.Router();
const memberModel = require('../models/memberModel');
const token = require('../jwt/jwt');

router.post('/member/register', memberModel.memberRegist);
router.post('/member/confirm_register', token, memberModel.createMember);
router.put('/member/send_mail_again', memberModel.sendMailAgain);
router.post('/member/login', token, memberModel.memberLogin);
router.put('/member/forgot_password',memberModel.forgotPassword);
router.put('/member/confirm_email', memberModel.confirmEmailWhenForgotPassword);
router.put('/member/edit/username', memberModel.editMemberUsername);
router.put('/member/edit/password', memberModel.editMemberPassword);
router.post('/member/get_member_user', memberModel.getMemberUser);

router.put('/member/edit/banstate', memberModel.editBanState);
router.get('/member/delete', memberModel.deleteMember);
router.get('/member/get', memberModel.getAllMember);
router.get('/member/search', memberModel.searchMember);

module.exports = router;