const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require('../Utils/customError');
const util = require('util');
const sendEmail = require('../Utils/email');
const crypto = require('crypto');
const authController = require('./authController');

const signToken = id =>{
    return jwt.sign({id}, process.env.SECRET_STR,{
        expiresIn: process.env.LOGIN_EXPIRES
    })
};

const createSendRespond = (user, statusCode, res)=>{
    const token = signToken(user._id);

    const option = {
        maxAge: parseInt(process.env.LOGIN_EXPIRES),
        httpOnly: true
    }

    if(process.env.NODE_ENV ==='production'){
        option.secure = true;
    }
    res.cookie('jwt',token,option);

    user.password = undefined;
        

    res.status(statusCode).json({
        status: 'succes',
        token,
        data: {
            user
        }
    })
};

const filterReqObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(prop =>{
        if(allowedFields.includes(prop)){
            newObj[prop] = obj[prop];
        }
    })
    return newObj;
}

exports.getAllUsers = asyncErrorHandler(async(req,res,next)=>{
    const users = await User.find();

    createSendRespond(users,200,res);
})

exports.updatePassword = asyncErrorHandler(async(req,res,next)=>{
    const user = await User.findById(req.user._id).select('+password');

    if(!(await user.comparePasswordInbDB(req.body.currentPassword, user.password))){
        return next(new customError('The Password is Wrong',401));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createSendRespond(user,200,res);
});

exports.updateMe = asyncErrorHandler(async(req,res,next)=>{
    if(req.body.password || req.body.confirmPassword){
        return next(new customError('You cant change the password at this endpoint',40));
    };

    const filterObj = filterReqObj(req.body,'name','email'); 
    const updateUser = await User.findByIdAndUpdate(req.user.id,filterObj,{runValidators: true, new:true});
    createSendRespond(updateUser,200,res);
});

exports.deleteMe = asyncErrorHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active: false});

    res.status(204).json({
        status: 'succes',
        data: null    
    });
    
});