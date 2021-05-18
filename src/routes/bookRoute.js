const express = require('express');
const router = express.Router();
const bookModel = require('../models/bookModel');


router.post('/view_as_all', bookModel.viewBookAsAll);
router.post('/view_as_search', bookModel.viewBookAsSearch);
router.post('/view_as_view', bookModel.viewBookAsView);
router.post('/view_as_like', bookModel.viewBookAsLike);
router.post('/view_as_download', bookModel.viewBookAsDownload);
router.post('/view_as_bookmark', bookModel.viewBookAsBookmark);
router.post('/get_author', bookModel.getAuthor);

router.post('/view_book_file', bookModel.viewBookFile);
router.post('/upload_proposal_file', bookModel.uploadProposalFile);
router.post('/upload_book_file', bookModel.uploadBookFile);
router.post('/view_book_file', bookModel.viewBookFile);
router.get('/download_book_file', bookModel.downloadBookFile);

router.post('/like', bookModel.like);
router.post('/get_like', bookModel.getLike);
router.post('/dislike', bookModel.dislike);

router.post('/bookmark', bookModel.bookmark);
router.post('/get_bookmark', bookModel.getBookmark);
router.post('/unbookmark', bookModel.unbookmark);
// router.post('/login', token, memberModel.memberLogin);
// router.put('/forgot_password',memberModel.forgotPassword);
// router.put('/confirm_email', memberModel.confirmEmailWhenForgotPassword);
// router.put('/edit/username', memberModel.editMemberUsername);
// router.put('/edit/password', memberModel.editMemberPassword);
module.exports = router;