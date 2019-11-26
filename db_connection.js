const axios = require('axios')
const app = require('express')
const mongoose = require('mongoose')
const url = "mongodb+srv://joachim-5537:3857664jc@cluster0-ycirg.mongodb.net/movie?retryWrites=true&w=majority"
const movie = require('./movieSchema');
const user = require('./userSchema');



// var movieSchema = new mongoose.Schema({
//     title : String,
//     type : String,
//     year : Number,
//     imdb_id : String,
//     poster : String
// });


function addMovie(data){
    newMovie = new movie({
        title: data['movie_title'],
        type: data['movie_type'],
        year: data['year'],
        imdb_id: data['imdb_id'],
        poster: data['movie_poster'],
        username: sess.username
    });

    newMovie.save().then(result=>{
        console.log(result)
    })

    return true;
}

function login(data){
    loginUser = new user({
        username: data['username'],
        password: data['password']
    });
    // console.log(data)

    user.find({username: data['username'],
    password: data['password']}).then(result=>{
        // console.log(result[0].username);
        if(result.length > 0){
            // console.log(result[0].username)
            // console.log(result[0].username)
            // app.use(session({username: result[0].username, saveUninitialized: true,resave: true}));
            // return result[0].username;
            return 123;
        }
        else{
            return false;
        }
    })
}


module.exports.addMovie = addMovie;
module.exports.login = login;
// module.exports = mongoose.model('Posts', movieSchema)