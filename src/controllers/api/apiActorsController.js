const db = require('../../database/models');
const Op = db.Sequelize.Op;

//lo siguiente es para armar la url que queremos mostrar al usuario 
const getUrl = (req) => req.protocol + '://' + req.get('host') + req.originalUrl;
const getBaseUrl = (req) => req.protocol + '://' + req.get('host');

const apiActorsController = {
    getAllActors: (req, res) => {
        db.Actor.findAll({
            include: [{association: 'movies'}]
        })
        .then(actors => {
            return res.status(200).json({
                meta: {
                    url: getUrl(req),
                    status: 200,
                    total: actors.length
                },
                data: actors
            })
        })
    },
    getOneActor: (req,res) => {
        db.Actor.findOne({
            where: {
                id: req.params.id
            },
            include: [{association: 'movies'}]
        })
        .then(actor => {
            return res.status(200).json({
                meta: {
                    url: getUrl(req),
                    status: 200
                },
                data: actor
            })
        })
    },
    create: (req, res) => {
        const { first_name, last_name, rating, favorite_movie_id } = req.body;
        db.Actor.create({ first_name, last_name, rating, favorite_movie_id })
        .then(actor => {
            return res.status(201).json(actor)
        })
    },
    update: (req, res) => {
        const { first_name, last_name, rating, favorite_movie_id } = req.body;
        db.Actor.update({ 
            first_name,
            last_name, 
            rating, 
            favorite_movie_id },{
                where: {id:req.params.id}
            })
        .then(() => {
            return res.status(200).json({
                msg: 'Updated successfully'
            })
        })
        .catch(error => res.status(400).send(error))
    },
    destroy: (req, res) => {
        db.Actor.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            return res.status(200).json({
                msg: 'Delete successfully'
            })
        })
        .catch(error => res.status(400).send(error))
    }
}
    
module.exports = apiActorsController;