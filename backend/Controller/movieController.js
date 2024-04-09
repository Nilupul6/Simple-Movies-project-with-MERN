//const { param } = require('../Routes/moviesRoutes');
const Movie = require('../Models/movieModel');
const Apifeatures = require('../Utils/ApiFeatures');
const asynsErrorHandler = require('../Utils/asyncErrorHandler');
const customError = require('../Utils/customError');

// exports.validateBody = (req,res,next)=>{
//     if(!req.body.Name || !req.body.Year ){
//         return res.status(400).json({
//             status: "Failed",
//             message: "Bad Request"
//         })
//     }
//     next();
// }
exports.highestRated = (req,res,next)=>{
    req.query.limit = 5;
    req.query.sort ='-rating';

    next();
};

exports.getAllmovie = asynsErrorHandler(async (req,res,next)=>{
    
        const features = new Apifeatures(Movie.find(),req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();


        
        const movies = await features.query;

        res.status(200).json({
            status: "success",
            length: movies.length,
            data: movies
        })
    
    
});

exports.getAmovie = asynsErrorHandler(async (req,res,next)=>{
    
        const movies = await Movie.findById(req.params.id);

        if(!movies){
            const error = new customError('Movie with id is not found!',404);
            return next(error);
        }

        res.status(200).json({
            status: "Success",
            data : movies
            
        })
    
    
});

exports.updateMovie = asynsErrorHandler(async (req,res,next)=>{

        const movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});

        if(!movie){
            const error = new customError('Movie with id is not found!',404);
            return next(error);
        }

        res.status(200).json({
            status: "Updated",
            data: movie
        })
    
    
});
exports.deleteMovie = asynsErrorHandler(async (req,res,next)=>{
    
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if(!movie){
            const error = new customError('Movie with id is not found!',404);
            return next(error);
        }
        
        res.status(204).json({
            status: "Deleted",
            data : null
        })
    
    
});

exports.createMovie =asynsErrorHandler(async (req,res,next)=>{

        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: "Success",
            data : {
                movie: movie,
            }
        });
});

exports.getMovieStats = asynsErrorHandler(async (req,res,next)=>{
    
        const stats = await Movie.aggregate([
            {$match: {rating: {$gte: 2}}},
            {$group: {
                _id: '$releaseYear',
                avgRating: {$avg: '$rating'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
                priceTotal: {$sum: '$price'},
                movieCount: {$sum: 1},
            }},
            { $sort: {minPrice: 1}},
            { $match: {maxPrice: {$gte: 10}}}
        ]);

        res.status(200).json({
            status: "Success",
            data : {
                stats
            }
        })
    
});

exports.getMovieByGenre = asynsErrorHandler(async (req,res,next)=>{
    
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {$unwind: '$genres'},
            {$group:{
                _id: '$genres',
                movieCount: {$sum: 1},
                movies:{$push: '$name'}
            }},
            {$addFields: {genre: "$_id"}},
            {$project: {_id: 0}},
            {$sort: {movieCount:-1}},
            {$match: {genre: genre}}
        ]);
        res.status(200).json({
            status: "Success",
            data : {
                movies
            }
        })

    
});