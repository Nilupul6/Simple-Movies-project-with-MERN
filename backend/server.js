const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});

process.on('uncaughtException',(err)=>{
    console.log(err.name,err.message);
    console.log('Uncaught Exception occured! shutting down...');

    server.close(()=>{
        process.exit(1);
    })
});

const app = require('./app');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    //console.log(conn);
    console.log("DB Connection Successfull");
})


const server = app.listen(port,(req,res)=>{
    console.log("Server is running");
});

process.on('unhandledRejection',(err)=>{
    console.log(err.name,err.message);
    console.log('Unhandled Rejection occured! shutting down...');

    server.close(()=>{
        process.exit(1);
    })
});

