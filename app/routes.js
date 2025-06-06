module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('recipes').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// recipe board routes ===============================================================

    app.post('/recipes', (req, res) => {
      db.collection('recipes').save(
        { 
          name: req.body.name, 
          ing: req.body.ing, 
          instr: req.body.instr,

          thumbUp: 0, 
          thumbDown:0}, 
        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/thumbUp', (req, res) => {
      db.collection('recipes')
      .findOneAndUpdate(
        {
          name: req.body.name,
        }, 
        {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/thumbDown', (req, res) => {
      db.collection('recipes')
      .findOneAndUpdate(
        {
          name: req.body.name,  
        }, 
        {
        $set: {
          thumbUp:req.body.thumbUp - 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/recipes', (req, res) => {
      db.collection('recipes').findOneAndDelete(
        {
          name: req.body.name,
        }, 
        (err, result) => {
        if (err) return res.send(500, err)
        res.send('Recipe deleted!')
      })
    })
// open recipe in a new page ===============================================================
const { ObjectId } = require('mongodb'); // add this at the top of your file

app.get('/recipes/:id', (req, res) => {
  const recipeId = req.params.id;

  db.collection('recipes').findOne({ _id: ObjectId(recipeId) }, (err, recipe) => {
    if (err || !recipe) {
      return res.status(404).send('Recipe not found');
    }

    res.render('recipe.ejs', { recipe });
  });
});

app.post('/recipes/:id/comments', (req, res) => {
  const recipeId = req.params.id; 
  const { author, text } = req.body;

  db.collection('recipes').updateOne(
    { _id: ObjectId(recipeId) }, // ✅ make sure ObjectId is imported
    { $push: { comments: { author, text } } },
    (err, result) => {
      if (err) return res.status(500).send('Error adding comment');
      res.redirect('/recipes/' + recipeId);
    }
  );
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
