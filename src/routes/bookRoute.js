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

// unSelected Request Proposal
router.put('/book/unselected_proposal/update', bookModel.updateUnselected_proposal);
router.get('/book/unselected_proposals', bookModel.getAllUnselected_proposals);
router.get('/book/unselected_proposal/:id', bookModel.getUnselectedRequestProposalById);


// approve research  
router.put('/book/approve/create', bookModel.createApproveResearchBook);
router.get('/book/approves', bookModel.getAllApproveResearchBook);
router.get('/book/approve/:id', bookModel.getSingleApproveResearchById);
router.put('/book/approve/cancel', bookModel.cancelApproveResearchBook);
router.put('/book/approve/update', bookModel.updateApproveResearchBook);

router.put('/book/approveNavigation100/update', bookModel.updateApproveResearchBook100);

// /research_paper_navigation/procedure_0_50_percentage 
router.put('/book/procedure/create', bookModel.createApproveResearchBookProcedure_0_50_percentage);
router.put('/book/procedure/cancel', bookModel.cancelApproveResearchBookProcedure_0_50_percentage);

// /research_paper_navigation/procedure_0_70_percentage
router.put('/book/approveSecondFase/cancel', bookModel.cancelApproveResearchSecondFaseBook);
router.put('/book/procedureSecondFase/create', bookModel.createApproveResearchBookProcedure_50_70_percentage);
router.get('/book/procedureTwos', bookModel.getAllApproveResearchBookProcedure_0_70_percentage);

// /research_paper_navigation/procedure_70_100_percentage
router.put('/book/approveThirdFase/cancel', bookModel.cancelApproveResearchThirdFaseBook);
router.get('/book/procedureThree', bookModel.getAllApproveResearchBookProcedure_70_100_percentage);

// // research_paper_upload
router.put('/research_paper_upload/edit', bookModel.updateResearch_paper_upload);
router.put('/research_paper_upload', bookModel.createResearch_paper_upload);
router.put('/research_paper_upload/cancel', bookModel.cancelResearch_paper_upload);
router.get('/research_paper_uploads', bookModel.getAllApproveResearchBookFile);

// research_paper_upload_state = 0
router.put('/research_paper_upload_state/false', bookModel.updateResearch_uploadState_false);
// research_paper_upload_state = 1
router.put('/research_paper_upload_state/true', bookModel.updateResearch_uploadState_true);





//report---------------------------------------------------------------------------
router.post('/book/report/getAuthor', bookModel.getAuthorReport);

// report_Offer_research ລາຍງານບົດສະເໜີຄົ້ນຄວ້າ

router.post('/book/report/count_offer_book_one_year', bookModel.countOfferBookReportOneYear);
router.post('/book/report/count_offer_book_between_year', bookModel.countOfferBookReportBetweenYear);
router.post('/book/report/netural_offer_book_one_year', bookModel.naturalOfferBookReportOneYear);
router.post('/book/report/netural_offer_book_between_year', bookModel.naturalOfferBookReportBetweenYear);
router.post('/book/report/social_offer_book_one_year', bookModel.socialOfferBookReportOneYear);
router.post('/book/report/social_offer_book_between_year', bookModel.socialOfferBookReportBetweenYear);

// report_research ລາຍງານບົດຄົ້ນຄວ້າ

router.post('/book/report/count_book_one_year', bookModel.countBookReportOneYear);
router.post('/book/report/netural_book_one_year', bookModel.naturalBookReportOneYear);
router.post('/book/report/social_book_one_year', bookModel.socialBookReportOneYear);
router.post('/book/report/count_book_between_year', bookModel.countBookReportBetweenYear);
router.post('/book/report/netural_book_between_year', bookModel.naturalBookReportBetweenYear);
router.post('/book/report/social_book_between_year', bookModel.socialBookReportBetweenYear);


// approved Research

router.post('/book/report/approved_book', bookModel.approvedBookReport);

router.post('/book/report/unapprove_book_one_year', bookModel.unapproveBookReportOneYear);
router.post('/book/report/unapprove_book_between_year', bookModel.unapproveBookReportBetweenYear);

router.post('/book/report/nearly_dateline_book', bookModel.nearlyDatelineBookReport);

router.get('/book/report/over_dateline_book', bookModel.overDatelineBookReport);


// report_research_complete_to_book

router.post('/book/report/complete_book_one_year', bookModel.completeBookReportOneYear);


router.post('/book/report/complete_book_between_year', bookModel.completeBookReportBetweenYear);

router.get('/book/total_like', bookModel.getAllTotalLike);

router.get('/book/total_like/:id', bookModel.getTotalLikeById);


// success upload book getSuccessUploadBook

router.get('/success/upload/book', bookModel.getSuccessUploadBook);







module.exports = router;
