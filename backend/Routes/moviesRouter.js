const express = require('express');

const movieController = require('./../Controller/movieController')
const authController = require('../Controller/authController');

// app.get('/api/v1/movie',getAllmovie);
// app.get('/api/v1/movie/:id',getAmovie);
// app.patch('/api/v1/movie/:id', updateMovie);
// app.delete('/api/v1/movie/:id', deleteMovie);
// app.post('/api/v1/movie', createMovie);

const Router = express.Router();

Router.route('/movie-stats').get(movieController.getMovieStats);

//Router.param('id',movieController.checkID);
Router.route('/highestRated').get(movieController.highestRated,movieController.getAllmovie);

Router.route('/movies-by-genre/:genre').get(movieController.getMovieByGenre);

Router.route('/')
    .get(movieController.getAllmovie)
    .post(movieController.createMovie)
    // .get(authController.protect,movieController.getAllmovie)
    //.post(authController.protect,movieController.createMovie)

Router.route('/:id')
    .get(movieController.getAmovie)
    .patch(movieController.updateMovie)
    .delete(movieController.deleteMovie)
    .post(movieController.updateMovie)
    // .get(authController.protect,authController.protect,movieController.getAmovie)
    // .patch(authController.protect,movieController.updateMovie)
    // .delete(authController.protect,authController.restrict('admin'),movieController.deleteMovie)
    // .post(authController.protect,movieController.updateMovie)



module.exports = Router;