const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');



const movieRouter = require('./Routes/moviesRouter');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const errors = require('validators/lib/errors');
const customError = require('./Utils/customError');
const globalErrorController = require('./Controller/globalErrorController');

let app = express();

app.use(cors());

app.use(helmet());


let limiter = rateLimit({
    max: 10000000,
    windowMs: 1000*60*60,
    message: 'we have recieved too many request from this IP. please try after one hour'
});

app.use('/api',limiter);

const logger = function(req,res,next){
    console.log("Middleware is called");
    next();
}

app.use(express.json({limit: '10kb'}));

app.use(sanitize());
app.use(xss());
app.use(hpp({whitelist:[
    "name",
    "description",
    "duration",
    "rating",
    "totalRating",
    "releaseYear",
    "releaseDate",
    "genres" ,
    "directors",
    "actors",
    "price",
]}));


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.static('./public'));
app.use(logger);
app.use((req,res,next)=>{
    req.requstedAt = new Date().toISOString();
    next();
})


app.use('/api/v1/movie',movieRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status: "Failed",
    //     message: `cant find ${req.originalUrl} on the server`
    // });

    // const err = new Error(`cant find ${req.originalUrl} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    const err = new customError(`cant find ${req.originalUrl} on the server`,404);
    next(err);
});

app.use(globalErrorController);


module.exports = app;



