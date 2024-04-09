const express = require('express');
const Router = express.Router();

const authController = require('../Controller/authController');
const userController = require('../Controller/userController');

Router.route('/updatePassword').patch(
    authController.protect,
    userController.updatePassword
);

Router.route('/updateMe').patch(
    authController.protect,
    userController.updateMe
);

Router.route('/deleteMe').get(
    authController.protect,
    userController.deleteMe
);

Router.route('/getAllUsers').get(
    userController.getAllUsers
);


module.exports = Router;