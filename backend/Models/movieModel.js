const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');


const movieSchema = mongoose.Schema({
    name:{
        type : String,
        required : [true,"Name is required firld"],
        unique : true,
        maxlength: [50,"Movie name must have less than 50 characters"],
        minlength:[4,"Movie name must have more than 4 character"],
        // validate: [validator.isAlpha,"Name should only contain alphabert"],
        trim:true
    },
    description:{
        type : String,
        required : [true,"Description is required firld"],
        trim:true
    },
    duration:{
        type : Number,
        required : [true,"Duration is required field"]
    },
    rating:{
        type : Number,
        // min:[1,"Rating must be 1.0 or above"],
        // max:[10,"Rating must be 10 or below"]
        validate:{
            validator: function(value){
                return value>=1 && value<=10;
            },
            message: "Rating ({VALUE}) should be above 1 and below 10"
        }
    },
    totalRating:{
        type: Number
    },
    releaseYear:{
        type: Number,
        required : [true,"release year is required field"]
    },
    releaseDate:{
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    genres:{
        type:[String],
        required : [true,"genre year is required field"],
        // enum: {
        //     values:["Action","Adventure","Sci-fi","Thriller","Crime","Drama","Comedy","Romance","Biography"],
        //     message: "This genre doesnt exist"
        // }
    },
    directors:{
        type:[String],
        required : [true,"director year is required field"]
    },
    coverImage:{
        type:[String],
        required : [true,"Cover image is required field"]
    },
    actors:{
        type:[String],
        required : [true,"actors is required field"]
    },
    price:{
        type:Number,
        required : [true,"Price is required field"]
    },
    createdBy:{
        type: String
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
});

movieSchema.pre('save', function(next){
    this.createdBy = "Nilupul";
    next();
});

movieSchema.post('save',function(doc,next){
    const content = `A new movie document name with ${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err);
    });
    next();
});

movieSchema.pre(/^find/, function(next) {
    this.where('releaseDate').lte(Date.now());
    this.startTime = Date.now();
    next();
});
movieSchema.post(/^find/, function(doc,next) {
    const content = `A query took ${this.startTime - this.endtTime} millisecond\n`
    fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err);
    });
    this.endtTime = Date.now();
    next();
});
movieSchema.pre('aggregate',function(next){
    console.log(this.pipeline().unshift({$match: {releaseDate: {$lte:new Date()}}}))
    next();
});


const Movie = mongoose.model('Movie',movieSchema);

module.exports = Movie;