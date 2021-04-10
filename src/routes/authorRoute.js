const express = require('express');
const router = express.Router();
const authorModel = require('../models/authorModel');
const verifyToken = require('../jwt/jwt');

router.post('/add', authorModel.createAuthor);
router.put('/edit', authorModel.editAuthor);
router.delete('/delete', authorModel.deleteAuthor);
router.get('/getAll', verifyToken, authorModel.getAllAuthor);
router.get('/getOne', authorModel.getOneAuthor);
router.get('/search', authorModel.searchAuthor);

module.exports = router;