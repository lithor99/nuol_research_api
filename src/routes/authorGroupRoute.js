const express = require('express');
const router = express.Router();
const authorGroup = require('../models/authorGroupModel');



router.post('/authorGroup/create', authorGroup.createAuthor_group);
router.delete('/authorGroup/delete', authorGroup.deleteAuthor_group);
router.get('/authorGroup/:id', authorGroup.getSingleAuthorGroup);


module.exports = router;