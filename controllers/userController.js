const bcryptjs = require('bcryptjs');
const userService = require('../services/userServices');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config();
exports.register = (req, res, next) => {
    // console.log("The body : ",req.body);
    const { password } = req.body;

    if (!password) {
        return res.status(400).send({ message: "Password is required" });
    }

    const salt = bcryptjs.genSaltSync(10);
    req.body.password = bcryptjs.hashSync(password, salt);

    userService.register(req.body, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "success",
            data: result,
        });
    });
}

exports.login = (req, res, next) => {
    console.log("The body in login", req.body);
    const { username, email, password } = req.body;
    const identifier = username || email;
    userService.login({ identifier, password }, res, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Login Successful",
            data: result,
        });
    });
};


exports.userProfile = async (req, res, next) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);
        if (!claims) {
            return res.status(401).send({
                message: "Unauthenticated"
            })
        }
        const user = await User.findOne({ username: claims.data }).lean();
        res.send(user);
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        })
    }
}

exports.logout = async (req, res, next) => {
    userService.logout(res, (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: 'logout successfull',
        })
    })
}