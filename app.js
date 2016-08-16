

const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser"); //post request for
const session = require('express-session');

/* BCrypt stuff here */
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'perfect weather is the best',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // never works localy thats why set false
}))

var db = pgp('postgres://davesarr@localhost:5432/project_2');

app.get ('/', function(req, res){
  var logged_in,
      email;

      if (req.session.user){
        logged_in = true;
        email = req.session.user.email;
      }

      var data ={
        'logged_in' : logged_in,
        'email': email
      }
  res.render('index', data);
  });

app.post('/login', function(req, res){
  var data = req.body;
  db.one(
    'SELECT * FROM users WHERE email = $1',
    [data.email]
    ).catch(function(){
      res.send('Authorization failed. Check your email/password.');
//check that the user exists
      }).then(function(user){
        data.password == user.password
        bcrypt.compare(
        data.password,
        user.password_digest,
        function(err, match){
          if (match){
            req.session.user = user;
            res.redirect('/');
          }else{
            res.send('error');
          }

          }
        );
    });
});



app.get('/signup', function(req,res){
  res.render('signup/index');
});

app.post('/signup', function(req, res){
  var data = req.body;

bcrypt.hash(data.password, 10, function(err, hash){

  db.none(
    "INSERT INTO users(email, password_digest) VALUES ($1, $2)",
      [data.email, hash]
        ).catch(function(){
        res.send('PLEASE TRY AGAIN !!')
      }).then(function(){
    res.send('you are all set.');
    });
  });


});
app.get('/logout', function(req, res){
  req.session.user = null;
  res.redirect('/');
});



app.post('/hot', function(req,res){
  db.any('SELECT * FROM hot').then(function(data){
    var hot = {
      'title':'Hot',
      'hot':data
    }
    console.log(hot)
    res.send(hot)

  })
})

///////////////////////////
app.post('/cold', function(req,res){
  db.any('SELECT * FROM cold').then(function(data){
    var cold= {
      'title':'Cold',
      'cold':data
    }
    console.log(data);
    res.send(cold)
  })
})
////////

app.post('/rainy', function(req,res){
  db.any('SELECT * FROM rainy').then(function(data){
    var rainy= {
      'title':'Rainy',
      'rainy':data
    }
    console.log(data);
    res.send(rainy)
  })
})
//////

////
app.delete('/users/:id',function(req,res){
  id = req.params.id
  db.none("DELETE FROM users WHERE id=$1",[id]).then(function(data){
      console.log('delete done!!!!!')
      res.render('signup/index.html')
    })
})


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//use res.redirect
// app.listen(3000, function () {
//   console.log('its working');
// });
