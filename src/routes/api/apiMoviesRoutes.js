const express = require('express');
const router= express.Router();

const apiMoviesController = require('../../controllers/api/apiMoviesController');

router.get('/api/movies/', apiMoviesController.getAllMovies);
router.get('/api/movies/:id', apiMoviesController.getOneMovie);
router.post('/api/movies/create', apiMoviesController.create);
router.put('/api/movies/update/:id', apiMoviesController.update);
router.delete('/api/movies/delete/:id', apiMoviesController.destroy);


module.exports = router;