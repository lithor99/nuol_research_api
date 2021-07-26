
const express = require('express');
const router = express.Router();
const memberModel = require('../models/memberModel');
const token = require('../jwt/jwt');

router.post('/member/register', memberModel.memberRegist);
router.post('/member/confirm_register', memberModel.createMember);
router.put('/member/send_mail_again', memberModel.sendMailAgain);
router.put('/member/upload_profile', memberModel.uploadMemberProfile);
router.post('/member/login', memberModel.memberLogin);

router.post('/member/get_member_data', memberModel.getMemberData);
router.put('/member/forgot_password', memberModel.forgotPassword);


// router.post('/member/get_member_data', token, memberModel.getMemberData); 


router.put('/member/confirm_email', memberModel.confirmEmailWhenForgotPassword);
router.put('/member/edit/username', memberModel.editMemberUsername);
router.put('/member/edit/password', memberModel.editMemberPassword);

router.put('/member/edit/banstate', memberModel.editBanState);
router.get('/member/delete', memberModel.deleteMember);
router.get('/member/get', memberModel.getAllMember);
router.get('/member/search', memberModel.searchMember);


// tb_like

router.get('/Grouplike/:id', memberModel.getSingleLike);
router.delete('/Grouplike/delete', memberModel.deleteLike);

// tb_bookmark
router.get('/GroupBookMark/:id', memberModel.getSingleBookMark);
router.delete('/GroupBookMark/delete', memberModel.deleteBookMark);


// CRUD-Admin
router.get('/members', memberModel.getMembers);
router.get('/member/:id', memberModel.getMemberById);
router.delete(`/member/delete/:id`, memberModel.deleteMemberById)
router.put('/member/update/:id', memberModel.editMemberBan)





module.exports = router;