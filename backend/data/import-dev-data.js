const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});
const Movie = require('./../Models/movieModel');

const fs = require('fs');

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    //console.log(conn);
    console.log("DB Connection Successfull");
}).catch((err)=>{
    console.log(err);
});

const movie = JSON.parse(fs.readFileSync('./data/movie.json','utf-8'));

const deleteMovie =async ()=>{
    try {
        await Movie.deleteMany();
        console.log("Successfully Deleted");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

const importMovie =async ()=>{
    try {
        await Movie.create(movie);
        console.log("Successfully Imported");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if(process.argv[2] === '--delete'){
    deleteMovie();
}
if(process.argv[2] === '--import'){
    importMovie();
}


