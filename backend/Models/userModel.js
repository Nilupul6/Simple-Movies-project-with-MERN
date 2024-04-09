const mongoose = require('mongoose');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please enter your name']
    },
    email:{
        type:String,
        required: [true, 'please enter your email'],
        unique:true,
        lowecase:true,
        validate: [validator.isEmail,'please enter valid email']
    },
    photo:String,
    role:{
        type:String,
        enum: ['user','admin'],
        default: 'user'
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:8,
        select: false
    },
    confirmPassword:{
        type:String,
        required:[true,'confirm your password'],
        validate:{
            validator:function(val){
                return val == this.password;
            },
            message: 'Password & Confirm pasword doesnt match'
        }
    },
    active:{
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date 
});

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
    next();
})

userSchema.methods.comparePasswordInbDB = async function(pwd, pwdDB){
    return await bcrypt.compare(pwd,pwdDB);
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if(this.passwordChangeAt){
        const pswdChangedTimestamp = parseInt(this.passwordChangeAt.getTime()/1000,10);
        return pswdChangedTimestamp >JWTTimestamp;
    }
    return false;
};

userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now()+ 10*60*1000;

    console.log(resetToken, this.passwordResetToken);

    return resetToken;
}

userSchema.pre(/^find/,function(next){
    this.find({active: {$ne: false}});
    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;