const errors = require('validators/lib/errors');
const customError = require('../Utils/customError');

const devError = (res,error)=>{
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error:error
    });
}
const prodError = (res,error)=>{
    if(error.isOperations){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    }
    else{
        res.status(500).json({
            status: 'error',
            message: 'something went wrong, try again',
        });
    }
}

const castErrorHandle = (error)=>{
    const msg = `Invalid value for ${error.path} : ${error.value} !`;
    return new customError(msg,400);
}

const duplicateHandle = (error)=>{
    const name = error.keyValue.name;
    const msg = `There is a already movie in a database with name: ${name}`;
    return new customError(msg,400);
}

const validationHandle = (error)=>{
    const errors = Object.values(error.errors).map(val => val.message);
    const errmsg = errors.join(',  ');
    const msg = `Invalid input data : ${errmsg}`
    return new customError(msg,400);
}

const handleExpiredjwt = (error)=>{
    return new customError('JWT has expired, please login again!',401);
}

const handleInvalidjwt = (error)=>{
    return new customError('Invalid token, please login again!',401);
}



module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500,
    error.status = error.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        devError(res,error);
    }
    else if(process.env.NODE_ENV === 'production'){
        if(error.name === 'CastError'){   error = castErrorHandle(error);   }
        else if(error.code ===11000 ){   error = duplicateHandle(error);   }
        else if(error.name ==='ValidationError' ){   error = validationHandle(error);   }
        else if(error.name === 'TokenExpiredError'){ error  = handleExpiredjwt(error); }
        else if(error.name === 'JsonWebTokenError'){ error = handleInvalidjwt(error); }
        prodError(res,error);
    }
}