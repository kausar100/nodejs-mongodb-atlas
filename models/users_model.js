const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        phoneNo:{
            type: String,
            default:""
        },
        isActive:{
            type: Boolean,
            required: true,
            default: false
        },
        latitude:{
            type: Number,
            default: 0.0
        },
        longitude:{
            type: Number,
            default: 0.0
        },
        createdAt:{
            type: String,
            default: Date.now()
        },


    }
);

module.exports = mongoose.model("users",userSchema);