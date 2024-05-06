const mongoose = require('mongoose');
const User = require('./users.model');
const Work = require('./works.model');
const Category = require('./categories.model');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = {};

db.mongoose = mongoose;
db.users = User(mongoose);
db.works = Work(mongoose);
db.categories = Category(mongoose);

module.exports = db;