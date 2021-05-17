const express = require('express');
const router = express.Router();
const authorModel = require('../models/authorModel');
const verifyToken = require('../jwt/jwt');

router.post('/author/create', authorModel.createAuthor);
router.put('/author/update/:id', authorModel.editAuthor);
router.delete('/author/delete/:id', authorModel.deleteAuthor);
// router.get('/getAll', verifyToken, authorModel.getAllAuthor);
router.get('/authors', authorModel.getAllAuthor);
router.get('/author/:id', authorModel.getOneAuthor);
router.get('/search', authorModel.searchAuthor);

module.exports = router;