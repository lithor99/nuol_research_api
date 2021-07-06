const express = require('express');
const router = express.Router();
const authorGroup = require('../models/authorGroupModel');



router.post('/authorDetail/create', authorGroup.createAuthor_group);
router.put('/authorDetail/update', authorGroup.updateAuthor_group);
router.delete('/authorDetail/delete', authorGroup.deleteAuthor_group);
router.get('/authorDetail/:id', authorGroup.getSingleAuthorGroup);



module.exports = router;