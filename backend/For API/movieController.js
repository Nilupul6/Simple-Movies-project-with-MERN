const fs = require('fs');
const Movie = require('../Models/movieModel');
let movie =JSON.parse(fs.readFileSync('./data/movie.json'));

exports.checkID = (req,res,next,value)=>{

    let found = movie.find(el => el.id===value*1);

    if(!found){
        return res.status(404).json({
            status: "Failed",
            message: "The Movie With Id="+value+" is not Found"
        })
    }
    next();
}

exports.validateBody = (req,res,next)=>{
    if(!req.body.Name || !req.body.Year ){
        return res.status(400).json({
            status: "Failed",
            message: "Bad Request"
        })
    }
    next();
}


exports.getAllmovie = (req,res)=>{
    res.status(200).json({
        status: "succes",
        Time: req.requstedAt,
        data : {
            movie : movie
        }
    })
};

exports.getAmovie = (req,res)=>{
    const id = parseInt(req.params.id);
    let found = movie.find(el => el.id===id);
    
        res.status(200).json({
            status: "success",
            data: {
                movie:found
            }
        })
     
};

exports.updateMovie = (req,res)=>{
    const id = req.params.id * 1;
    let found = movie.find(el => el.id===id);
    
        const index = movie.indexOf(found);

        Object.assign(found,req.body);
        movie[index] = found;

        fs.writeFile('./data/movie.json',JSON.stringify(movie),(err)=>{
            res.status(200).json({
                status: "Success",
                data: {
                    movie : found
                }
            })
        })
    
    
}
exports.deleteMovie = (req,res)=>{
    const id = req.params.id * 1 ;
    let found = movie.find(el => el.id===id);

        let index = movie.indexOf(found);
        movie.splice(index,1);

        fs.writeFile('./data/movie.json',JSON.stringify(movie),(err)=>{
            res.status(204).json({
                status: "success",
                data: {
                    movie: null
                }
            });
        });
    
}

exports.createMovie = (req,res)=>{
    const newId = movie[movie.length-1].id + 1 ;

    const newMovie = Object.assign({id: newId},req.body)

    movie.push(newMovie);

    fs.writeFile('./data/movie.json',JSON.stringify(movie),(err)=>{
        res.status(201).json({
            status: "succes",
            data: {
                movie: newMovie
            }
        })
    })
}