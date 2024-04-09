const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require('../Utils/customError');
const util = require('util');
const sendEmail = require('../Utils/email');
const crypto = require('crypto');

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

exports.signup = asyncErrorHandler(async (req,res,next)=>{
    const newUser = await User.create(req.body);

    createSendRespond(newUser,201,res);
});

exports.login = asyncErrorHandler(async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        const error = new customError('Provide email and password for loging in',400);
        return next(error);
    }

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.comparePasswordInbDB(password,user.password))){
        const error = new customError('Incorrect email or password',400);
        return next(error);
    }

    createSendRespond(user,200,res);

});

exports.protect = asyncErrorHandler(async (req,res,next)=>{
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer')){
        token = testToken.split(' ')[1];
    }
    if(!token){
        next(new customError('You are not logged in!',401));
    }

    const decodeToken = await util.promisify(jwt.verify)(token,process.env.SECRET_STR);

    const user = await User.findById(decodeToken.id);

    if(!user){
        next(new customError('The user with given token doent exist'));
    }

    const isPasswordChanged = await user.isPasswordChanged(decodeToken.iat);

    if(isPasswordChanged){
        return next(new customError('The password has been changed recently, please login again',401));

    }
    req.user = user;
    next();
});

exports.restrict = (role) =>{
    return (req,res,next)=>{
        if(req.user.role !== role){
            console.log(role);
            const error = new customError('You dont have permission to perform this action',403);
            next(error);
        }
        next();
    }
};

exports.forgotPassword = asyncErrorHandler(async (req,res,next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        const error = new customError('We couldnt find theuser with the given email',404);
        next(error);
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
    const message = `we have recived a password reset request. please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only 10 minute`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'password change request received',
            message: message,
        })
        res.status(200).json({
            status: 'success',
            message: 'password reset link sent to the user email' 
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave: false});

        return next(new customError('There was error sending email, please try again later',500));
    }
    

})

exports.resetPassword = asyncErrorHandler(async(req,res,next) =>{
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(token);
    const user = await User.findOne({passwordResetToken:token, passwordResetTokenExpires:{$gt:Date.now()}});
    console.log(user);

    if(!user){
        const error = new customError('Token is invalid or Expired',400);
        next(error);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    user.save();

    createSendRespond(user,201,res);


});

