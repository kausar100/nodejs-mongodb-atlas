const User = require("../models/users_model");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { generateToken } = require("../config/authenticator");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select({ __v: 0, password: 0 });
        if (users) {
            res.status(200).send(users);
        } else {
            res.status(200).send({
                success: true,
                message: "no users found"
            })
        }

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};


const getActiveUsers = async (req, res) => {
    try {
        const users = await User.find({ isActive: true }).select({ __v: 0, password: 0 });
        if (users) {
            res.status(200).send(users);
        } else {
            res.status(200).send({
                success: true,
                message: "no users found"
            })
        }

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};


const registerUser = async (req, res) => {
    try {

        const found = await User.findOne({ email: req.body.email });

        if (found) {
            return res.status(400).send({
                message: "user already exist"
            });
        }
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).send({
                    message: err.message
                });
            }
            const newUser = new User({
                name: req.body.name || "",
                email: req.body.email,
                phoneNo: req.body.phoneNo || "",
                password: hash,
                isActive: true,
                latitude: Number(req.body.latitude) || 0.0,
                longitude: Number(req.body.longitude) || 0.0
            });

            const user = await newUser.save();

            res.status(201).send({
                success: true,
                id: user._id,
                message: "user register successfully"
            });

        });


    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};


const loginUser = async (req, res) => {
    try {

        const found = await User.findOne({ email: req.body.email });

        if (found) {
            bcrypt.compare(req.body.password, found.password, function (err, result) {
                if (err) {
                    return res.status(500).send({
                        message: err.message
                    });
                }
                if (result == false) {
                    return res.status(401).send({
                        message: "Password don't match"
                    });
                } else {
                    const payload = {
                        id: found._id,
                        email: found.email
                    } 
                    //need to send token here
                    const token = generateToken(payload);
                   
                    res.status(200).send({
                        success: true,
                        message: "user login successfully",
                        token: "Bearer "+token
                    });
                }
            });

        } else {
            return res.status(401).send({
                message: "user doesn't exist"
            });
        }

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};

const updateUserLocation = async (req, res) => {
    try {
        const found = await User.findById(req.jwt_payload.id);

        if (found == null) {
            return res.status(404).send({
                message: "user doesn't exist"
            });
        }

        const result = await User.updateOne({ _id: found._id }, { isActive: !found.isActive })

        if (result) {
            res.status(200).send({
                success: true,
                id: result._id,
                message: "user location updated successfully"
            });
        } else {
            res.status(200).send({
                success: false,
                id: found._id,
                message: "couldn't update location for some reason"
            });
        }


    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};

module.exports = { getAllUsers, getActiveUsers, registerUser, loginUser, updateUserLocation }