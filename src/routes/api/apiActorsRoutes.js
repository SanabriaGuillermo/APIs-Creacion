const express = require('express');
const router = express.Router();

const apiActorsController = require('../../controllers/api/apiActorsController');

router.get('/api/actors', apiActorsController.getAllActors);
router.get('/api/actors/:id', apiActorsController.getOneActor);
router.post('/api/actors/create', apiActorsController.create);
router.put('/api/actors/update/:id', apiActorsController.update);
router.delete('/api/actors/delete/:id', apiActorsController.destroy);


module.exports = router;