const express = require('express');
const mongoose = require('mongoose');
const saleRouter = require('./Routes/saleRouter');
const authRouter=require('./Routes/authRouter')


const app = express();
app.use(express.json());

// Use the auth routes
app.use('/api/auth', authRouter);

// Use the sale routes
app.use('/api', saleRouter);


module.exports=app