const { ObjectID, ObjectId } = require('bson');

module.exports = function(app, passport, db) {

// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // PROFILE SECTION =========================
    app.get('/private', isLoggedIn, function(req, res) {
        db.collection('entries').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('private.ejs', {
            user : req.user,
            entries: result,
          })
        })
    });

    app.get('/public', isLoggedIn, function(req, res) {
        db.collection('entries').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('public.ejs', {
            user : req.user,
            entries: result,
          })
        })
    });

    app.get('/fullpost', isLoggedIn, function(req, res) {
        db.collection('entries').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('public.ejs', {
            user : req.user,
            entries: result,
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/entry', isLoggedIn, (req, res) => {
        console.log(req.user.local)
      db.collection('entries').insertOne({user: req.user.local.username, subject: req.body.subject, entry: req.body.entry, date: new Date(), privacy: req.body.privacy}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/public')
      })
    })

    app.delete('/entry', isLoggedIn, (req, res) => {
        console.log(req.body.user)
        console.log(req.body.subject)
      db.collection('entries').remove({user: req.body.user, subject: req.body.subject}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/public')
      })
    })

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
            successRedirect : '/public', // redirect to the secure profile section
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
            successRedirect : '/public', // redirect to the secure profile section
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
            res.redirect('/');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next(null, true);

    res.redirect('/');
}
