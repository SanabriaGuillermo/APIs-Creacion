const db = require('../../database/models');
const Op = db.Sequelize.Op;


//lo siguiente es para armar la url que queremos mostrar al usuario 
const getUrl = (req) => req.protocol + '://' + req.get('host') + req.originalUrl;
const getBaseUrl = (req) => req.protocol + '://' + req.get('host');

const apiGenresController = {
    getAllGenres: (req, res) => {
        db.Genre.findAll({
            include: [{association: 'movies'}]
        })
        .then(genres =>{
            return res.status(200).json({
                meta: {
                    status: 200,
                    total: genres.length,
                    url: getUrl(req)
                },
                data: genres
            })
        })
    },
    getOneGenre: (req, res) => {
        db.Genre.findOne({
            where: {
                id:req.params.id
            },
            include: [{association: 'movies'}]
        })
        .then(genre => {
            return res.status(200).json({
                meta: {
                    status: 200,
                    url: getUrl(req),
                    name: genre.name
                },
                data: genre
            })
        })
    }
}


module.exports = apiGenresController;