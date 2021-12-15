const express = require('express');
const router = express.Router();

const apiGenresController = require('../../controllers/api/apiGenresController');

router.get('/api/genres', apiGenresController.getAllGenres);
router.get('/api/genres/:id', apiGenresController.getOneGenre);



module.exports = router;