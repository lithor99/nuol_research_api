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
router.post('/book/get_book_file', bookModel.getBookFile);
router.post('/book/add_download', bookModel.addDownload);

router.put('/book/add_view', bookModel.addView);
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


//report---------------------------------------------------------------------------
router.put('/book/report/getAuthor', bookModel.getAuthorReport);
router.put('/book/report/count_offer_book_one_year', bookModel.countOfferBookReportOneYear);
router.put('/book/report/netural_offer_book_one_year', bookModel.naturalOfferBookReportOneYear);
router.put('/book/report/social_offer_book_one_year', bookModel.socialOfferBookReportOneYear);
router.put('/book/report/count_offer_book_between_year', bookModel.countOfferBookReportBetweenYear);
router.put('/book/report/netural_offer_book_between_year', bookModel.naturalOfferBookReportBetweenYear);
router.put('/book/report/social_offer_book_between_year', bookModel.socialOfferBookReportBetweenYear);

router.put('/book/report/count_book_one_year', bookModel.countBookReportOneYear);
router.put('/book/report/netural_book_one_year', bookModel.naturalBookReportOneYear);
router.put('/book/report/social_book_one_year', bookModel.socialBookReportOneYear);
router.put('/book/report/count_book_between_year', bookModel.countBookReportBetweenYear);
router.put('/book/report/netural_book_between_year', bookModel.naturalBookReportBetweenYear);
router.put('/book/report/social_book_between_year', bookModel.socialBookReportBetweenYear);

router.put('/book/report/approved_book', bookModel.approvedBookReport);
router.put('/book/report/unapprove_book_one_year', bookModel.unapproveBookReportOneYear);
router.put('/book/report/unapprove_book_between_year', bookModel.unapproveBookReportBetweenYear);
router.put('/book/report/nearly_dateline_book', bookModel.nearlyDatelineBookReport);
router.put('/book/report/over_dateline_book', bookModel.overDatelineBookReport);
router.put('/book/report/complete_book_one_year', bookModel.completeBookReportOneYear);
router.put('/book/report/complete_book_between_year', bookModel.completeBookReportBetweenYear);




module.exports = router;