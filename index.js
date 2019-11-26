const axios = require('axios')
const express = require('express')
const path = require('path')
var app = express();
var session = require('express-session');
var router = express.Router();
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose');
const user = require('./userSchema');
const movie = require('./movieSchema');
var bodyParser = require("body-parser");

const url = "mongodb+srv://joachim-5537:3857664jc@cluster0-ycirg.mongodb.net/movie?retryWrites=true&w=majority"
var sess;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => 
console.log('connected'))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// app .get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.use(session({secret: 'ssshhhhh'}))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', checkLogin, (req, res) => {
  res.render("pages/index",{
     logged : req.session.logged,
     username : req.session.username
  })
});

//register
app.get('/register', checkLogin, (req, res) => {
  res.render("pages/register",{
     logged : req.session.logged,
     username : req.session.username,
     error: 0
  })
});

app.post('/register', function(req, res){

  newUser = new user({
    username: req.body.username,
    password: req.body.password,
  });

  user.find({username: req.body.username,
    password: req.body.password}).then(result=>{
        // console.log(result[0].username);
        if(result.length == 0){
          newUser.save().then(result=>{
            // console.log(result[0].username);
            sess = req.session;
              sess.username;
              sess.username = req.body.username;
              res.redirect('/')
        })
        }else{
          app.get('/register', checkLogin, (req, res) => {
            res.render("pages/register",{
               logged : req.session.logged,
               username : req.session.username,
               error: 1
            })
          });
  
          res.redirect('/register');
        }
  })



});


// app.get('/search', checkLogin, (req, res) => {
//   res.render("pages/search",{
//      logged : req.session.logged,
//      username : req.session.username
//   })
// });

app.post('/search', function (req, res) {
    var search = req.body.search_movie;
    var search_url = 'http://www.omdbapi.com/?s='+search+'&apikey=8d50e5b2';

    var username = req.session.username;

    if(!username){
      app.get('/login', checkLogin, (req, res) => {
        res.render("pages/login",{
           logged : req.session.logged,
           username : req.session.username,
          //  error : 0
        })
      });

      res.redirect('/login')
    }

    axios.get(search_url)
      .then(function (response) {
        // handle success
        var movie_data = response.data['Search'];

        res.render('pages/search', {
          results : movie_data,
          logged : req.session.logged,
          username : req.session.username,
          error:null
        })
        // console.log(response.data['Search'][0]['Title']);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });


      // res.render('pages/search', {title : req.body.search_movie})
});

app.post('/insertMovie', function(req, res){
  sess = req.session
  console.log(123)
  // console.log(sess.username);
  newMovie = new movie({
    title: req.body.movie_title,
    type: req.body.movie_type,
    year: req.body.year,
    imdb_id: req.body.imdb_id,
    poster: req.body.movie_poster,
    username: sess.username,
    remark: ''
});

movie.find({username: sess.username,
  imdb_id: req.body.imdb_id}).then(result=>{
    if(result == 0){
      newMovie.save().then(result=>{
        console.log(result)
        res.redirect('/')
    })
    }else{
      res.send('This movie is added to favourite list before');
      res.render("pages/index",{
        logged : req.session.logged,
        username : req.session.username,

        // error : 'This movie is added to favourite list before'
     })
  
    }
  });


  
});

//login section
app.get('/login', checkLogin, (req, res) => {
  res.render("pages/login",{
     logged : req.session.logged,
     username : req.session.username
  })
});


app.post('/login', function(req, res){

  var db = require('./db_connection.js');

  user.find({username: req.body.username,
  password: req.body.password}).then(result=>{
      // console.log(result[0].username);
      if(result.length > 0){
        sess = req.session;
        sess.username;
        sess.username = req.body.username;
        res.redirect('/')
      }
  })

});

//register

function checkLogin(req, res, next) {

  var username = req.session.username;

  if(!username){
      // res.redirect('/');  // Redirect back to login
      // console.log('session invalid');
      req.session.logged = "no";
      next();
  }
  else {
      // console.log('session valid'); 
      req.session.logged = "yes";
      next();
  }
};

//logout
app.get('/logout', function(req, res){

  req.session.destroy();
  res.redirect('/login')

});

//get favourite
app.get('/favouriteList',function(req,res){

  var username = req.session.username;

  movie.find({username: username}).then(result=>{
    console.log(result)
        if(result.length > 0){
          res.render("pages/favouriteList",{
            logged : req.session.logged,
            username : req.session.username,
            results : result
         })

         res.redirect('/favouriteList');
        }else{
          console.log("nothing is added");
          res.render("pages/favouriteList",{
            logged : req.session.logged,
            username : req.session.username,
            results : 0
         })
          res.redirect('/favouriteList');
        }
        // console.log(result[0].username);
        // if(result.length > 0){
        //   sess = req.session;
        //   sess.username;
        //   sess.username = req.body.username;
        //   res.redirect('/')
        // }
    })
});

app.post('/deleteMovie', function(req, res){
  sess = req.session
  
  // console.log(sess.username);
//   newMovie = new movie({
//     title: req.body.movie_title,
//     type: req.body.movie_type,
//     year: req.body.year,
//     imdb_id: req.body.imdb_id,
//     poster: req.body.movie_poster,
//     username: sess.username
// });
// console.log( req.body.imdb_id)
// console.log( req.body.username)

  movie.remove({imdb_id : req.body.imdb_id, username : req.body.username}).then(result=>{

    res.redirect('/favouriteList')
})
  
});

app.post('/editRemark', function(req, res){

  // console.log(sess.username);
//   newMovie = new movie({
//     remark: req.body.remark,
//     imdb_id : req.body.imdb_id,
//     username : req.body.username
// });
console.log( req.body.imdb_id)
console.log( req.body.username)
console.log( req.body.remark)
  movie.update({imdb_id : req.body.imdb_id, username : req.body.username}, {$set: { "remark" : req.body.remark}}).then(result=>{

    res.redirect('/favouriteList')
})
  
});


 
