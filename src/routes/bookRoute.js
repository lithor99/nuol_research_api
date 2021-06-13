const express = require('express');
const router = express.Router();
const bookModel = require('../models/bookModel');
const token = require('../jwt/jwt');



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

// request book
router.post('/book/request/create', bookModel.createBookRequest);
router.get('/book/requests', bookModel.getAllRequestBook);
router.put('/book/request/:id', bookModel.updateRequestBookById);
router.get('/book/request/:id', bookModel.getRequestBookById);
router.delete('/book/request/delete', bookModel.deleteSingleRequestBook);

// approve research  
router.post('/book/approve/create', bookModel.createApproveResearchBook);
router.get('/book/approves', bookModel.getAllApproveResearchBook);
router.get('/book/approve/:id', bookModel.getSingleApproveResearchById);
router.put('/book/approve/cancel', bookModel.cancelApproveResearchBook);




module.exports = router;