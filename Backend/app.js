const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
      crossOriginResourcePolicy: false,
    }));

const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
module.exports = app;