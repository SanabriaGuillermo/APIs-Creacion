const db = require('../../database/models');
const Op = db.Sequelize.Op;

//lo siguiente es para armar la url que queremos mostrar al usuario 
const getUrl = (req) => req.protocol + '://' + req.get('host') + req.originalUrl;
const getBaseUrl = (req) => req.protocol + '://' + req.get('host');

const apiMoviesController = {
    getAllMovies: (req, res) => {
        db.Movie.findAll({
            include: [{association: 'genre'}, {association: 'actors'}]
        })
        .then(movies => {
            return res.status(200).json({
                meta:{
                    endPoint: getUrl(req),
                    status: 200,
                    total: movies.length
                },
                data: movies
            })
        })
        .catch(error => res.status(400).send(error))
    },
    getOneMovie: (req, res) => {
        if (req.params.id % 1 !== 0 || req.params.id<0) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    msg: 'Wrong ID'
                }
            })
        }else{
            db.Movie.findOne({
                where: {
                    id: req.params.id
                },
                include: [{association: 'genre'}, {association: 'actors'}]
            })
            .then(movie => {
                if(movie){
                    return res.status(200).json({
                        meta:{
                            endPoint: getUrl(req),
                            status: 200,
                            name: movie.title
                        },
                        data: movie
                    })
                }else{
                    res.status(404).json({
                        meta: {
                            status: 404,
                            msg: 'ID not found'
                        }
                    }) 
                }                
            })
            .catch(error => res.status(400).send(error))
        }        
    },
    create: (req, res) => {
        const {title, rating, awards, release_date, length, genre_id} = req.body;
        db.Movie.create({
            title, 
            rating, 
            awards, 
            release_date, 
            length, 
            genre_id})
        .then(movie => {
            return res.status(201).json({
                meta: {
                    status: 201,
                    created: 'Ok',
                    endPoint: getUrl(req)
                },                
                data: movie,                
            })
        })
        .catch(error => {
            switch (error.name) {
                case 'SequelizeValidationError':
                    let errorsMsg = [];
                    let notNullErrors = [];
                    let validationErrors = [];
                    error.errors.forEach(error => {
                        errorsMsg.push(error.message);
                        if(error.type == 'notNull Violation'){
                            notNullErrors.push(error.message)
                        }
                        if(error.type == 'Validation error'){
                            validationErrors.push(error.message)
                        }
                    });
                    let response = {
                        status: 400,
                        message: 'Missing or wrong data',
                        errors: {
                            quantity: errorsMsg.length,
                            msg: errorsMsg,
                            notNull: notNullErrors,
                            validations: validationErrors
                        }
                    }
                    return res.status(400).json(response)           
                default:
                    return res.status(500).json({
                        error
                    })
            }
        })
    },
    update: (req, res) => {
        const {title, rating, awards, release_date, length, genre_id} = req.body;
        db.Movie.update({
            where: {
                id: req.params.id
            }
        },{
            title, 
            rating, 
            awards, 
            release_date, 
            length, 
            genre_id})
        .then(result => {
            if(result){
                return res.status(200).json({
                    meta: {
                        status: 200,
                        msg: 'Updated successfully',
                        endPoint: getUrl(req)
                    },                
                    data: movie,                
                })
            }else{
                return res.status(400).json({
                    msg: 'Not changes'
                })
            }            
        })
        .catch(error => res.status(500).json(error))
    },
    destroy: (req, res) => {
        let actorUpdate = db.Actor.update({
            favorite_movie_id: null
        },{
            where: {
                favorite_movie_id : req.params.id
            }
        });
        let actorMovieUpdate= db.actor_movie.destroy({
            where: {
                movie_id: req.params.id
            }
        })
        Promise.all([actorUpdate, actorMovieUpdate]) 
        .then(
            db.Movie.destroy({
                where: {id: req.params.id}
            })
            .then(result => {
                if(result){
                    return res.status(200).json({
                        meta: {
                            status: 200,
                            msg: 'Delete successfully',
                            endPoint: getUrl(req)
                        },                
                        data: movie,                
                    })
                }else{
                    return res.status(400).json({
                        msg: 'Not changes'
                    })
                }
            })
            .catch(error => res.status(500).json(error))
        )
    }
}


module.exports = apiMoviesController;
