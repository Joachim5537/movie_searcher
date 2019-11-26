const mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    title : String,
    type : String,
    year : Number,
    imdb_id : String,
    poster : String,
    username : String,
    remark: String
});

module.exports = mongoose.model('movie_db', movieSchema, 'movie');