const express = require('express');
const router = express.Router();
const bookModel = require('../models/bookModel');


router.post('/book/view_as_all', bookModel.viewBookAsAll);
router.post('/book/view_as_search', bookModel.viewBookAsSearch);
router.post('/book/view_as_view', bookModel.viewBookAsView);
router.post('/book/view_as_like', bookModel.viewBookAsLike);
router.post('/book/view_as_download', bookModel.viewBookAsDownload);
router.post('/book/view_as_bookmark', bookModel.viewBookAsBookmark);
router.post('/book/get_author', bookModel.getAuthor);

router.post('/book/upload_proposal_file', bookModel.uploadProposalFile);
router.post('/book/upload_book_file', bookModel.uploadBookFile);
router.post('/book/view_book_file', bookModel.viewBookFile);
router.post('/book/download_book_file', bookModel.downloadBookFile);

router.post('/book/like', bookModel.like);
router.post('/book/get_like', bookModel.getLike);
router.post('/book/dislike', bookModel.dislike);
router.post('/book/bookmark', bookModel.bookmark);
router.post('/book/get_bookmark', bookModel.getBookmark);
router.post('/book/unbookmark', bookModel.unbookmark);
module.exports = router;