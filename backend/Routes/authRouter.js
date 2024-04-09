const express = require('express');
const authController = require('../Controller/authController');


const Router = express.Router();

Router.route('/signup').post(authController.signup);
Router.route('/login').post(authController.login);
Router.route('/forgotPassword').post(authController.forgotPassword);
Router.route('/resetPassword/:token').patch(authController.resetPassword);



module.exports = Router;