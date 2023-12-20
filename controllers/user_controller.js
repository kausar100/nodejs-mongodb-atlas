const User = require("../models/users_model");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { generateToken } = require("../config/authenticator");

const getAllUsers = async (req, res) => {
    try {
        const user = await User.findById(req.jwt_payload.id);

        if (user == null) {
            return res.status(401).send({
                message: "unauthorized"
            });
        }
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
        const user = await User.findById(req.jwt_payload.id);

        if (user == null) {
            return res.status(401).send({
                message: "unauthorized"
            });
        }

        if (user.isActive) {
            const result = await User.find({ isActive: true }).select({ __v: 0, password: 0 });
            const users = result.filter((p) => p._id != user.id);
            if (users) {
                res.status(200).send(users);
            } else {
                res.status(204).send({
                    success: true,
                    message: "no users found"
                })
            }
        } else {
            res.status(204).send({
                success: true,
                message: "you are not active"
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
            const lat = req.body.latitude ?? 0.0;
            const long = req.body.longitude ?? 0.0;
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                phoneNo: req.body.phoneNo,
                password: hash,
                isActive: true,
                latitude: Number(lat),
                longitude: Number(long)
            });

            const result = await newUser.save();

            if (result != null) {
                const user = await User.findById(result._id).select({ password: 0, __v: 0 });

                res.status(201).send({
                    success: true,
                    message: "user register successfully",
                    user
                });
            } else {
                return res.status(401).send({
                    message: "user registration failed for some reason"
                });

            }


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
                        token: "Bearer " + token,
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

const userInfo = async (req, res) => {
    try {
        const user = await User.findById(req.jwt_payload.id).select({ password: 0, __v: 0 });

        if (user == null) {
            return res.status(404).send({
                message: "user doesn't exist"
            });
        }

        res.status(200).send({
            success: true,
            user
        });


    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};

const clearDB = async (req, res) => {
    try {
        const result = await User.deleteMany();

        console.log(result);

        if (result == null) {
            return res.status(404).send({
                message: "user doesn't exist"
            });
        }

        res.status(200).send({
            success: true,
            'message': "users removed from db successfully"
        });


    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
};

const changeActiveStatus
    = async (req, res) => {
        try {
            const found = await User.findById(req.jwt_payload.id);

            if (found == null) {
                return res.status(404).send({
                    message: "user doesn't exist"
                });
            }

            const result = await User.updateOne({ _id: found._id }, { isActive: !found.isActive })

            if (result != null) {
                const user = await User.findById(found._id).select({ password: 0, __v: 0 });

                res.status(200).send({
                    success: true,
                    message: "user active status updated successfully",
                    user
                });
            } else {
                return res.status(401).send({
                    message: "couldn't update active status for some reason"
                });

            }

        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message
            })
        }
    };

module.exports = {
    getAllUsers, getActiveUsers, registerUser, loginUser, userInfo,
    changeActiveStatus,
    clearDB
}