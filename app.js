const express = require('express');
const cors = require('cors');

require('./config/db');
const userRouter = require('./routes/user_route');
const authRouter = require('./routes/auth_route');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api", userRouter);
app.use("/api/user", authRouter);

//invalid routes
app.use((req, res, next)=>{
    res.status(404).json({
        message: 'route not found'
    });
})

//server error
app.use((error, req, res, next)=>{
    res.status(500).json({
        message: 'something broke'
    });
})

module.exports = app;