const User = require('../models/user'), 
passport = require('passport'), 
mongoose = require('mongoose'),
ObjectID = mongoose.objectID;

const getUserParams = (body) => {
    return {
        name : {
            first : body.first, 
            last : body.last
        }, 
        email : body.email, 
        zipCode : body.zipCode, 
    };
};

module.exports={
    index : (request, response, next) => {
        User.find()
        .then((users) => {
            response.locals.users = users;
            next();
        })
        .catch((error) => {
            console.log(`Error fetching users : ${error}`);
            response.redirect('/');
        });
    },
    indexView : (request, response) => {
        response.render('users/index', {
            flashMessages : {
                success : "Loaded all users!"
            }
        });
    }, 
    new : (request, response) => {
        response.render('users/new');
    }, 
    create : (request, response, next) => {
        // let userParams = {
        //     name : {
        //         first : request.body.first, 
        //         last : request.body.last
        //     }, 
        //     email : request.body.email, 
        //     password : request.body.password, 
        //     zipCode : request.body.zipCode
        // };
        if(request.skip) {
            next();
        } 
            let newUser = new User(getUserParams(request.body));
            User.register(newUser, request.body.password, (error, user) => {
                if(user) {
                    request.flash('success', `${user.fullName}'s account created successfully!`);
                    response.locals.redirect = '/users';
                    next();
                } else {
                    request.flash('error', `Failed to create user account because : ${error.message}`);
                    response.locals.redirect = '/users/new';
                    next();
                }
            });
        },
        //     let userParams = getUserParams(request.body);
        //     User.create(userParams)
        //     .then((user) => {
        //         request.flash("Success", `${user.fullName}'s account created successfully!`)
        //         response.locals.redirect = '/users';
        //         response.locals.user = user;
        //         next();
        //     })
        //     .catch((error) => {
        //         console.log(`Error saving user : ${error.message}`);
        //         response.locals.redirect = '/users/new';
        //         request.flash("error", `Failed to create user account because : ${error.message}`);
        //         next(); 
        //     });
        // }
     redirectView : (request, response, next) => {
        let redirectPath = response.locals.redirect;
        if(redirectPath) response.redirect(redirectPath);
        else response.render('error');
    }, 
    show : (request, response, next) => {
        let userId = request.params.id;
        User.findById(new mongoose.Types.ObjectId(userId))
        .then(user => {
            response.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error fetching user by id (show error) : ${error.message}`);
            next(error);
        });
    }, 
    showView : (request, response) => {
        response.render('users/show');
    }, 
    edit : (request, response, next) => {
        let userId = (request.params.id);
        User.findById(new mongoose.Types.ObjectId(userId))
        .then(user => {
            response.render('users/edit', {
                user : user
            });
        })
        .catch(error => {
            console.log(`Error fetching user by id (edit error) : ${error.message}`);
            next(error);
        });
    }, 
    update : (request, response, next) => {
        let userParams = {
            name : {
                first : request.body.first, 
                last : request.body.last
            }, 
            password : request.body.password, 
            email : request.body.email, 
            zipCode : request.body.zipCode
        };
        let userId = new mongoose.Types.ObjectId(request.params.id);
        User.findByIdAndUpdate(userId, {
            $set : userParams
        })
        .then(user => {
            response.locals.redirect = `/users/${userId}`;
            response.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error updating user by id (updating error) : ${error.message}`);
            next(error);
        });
    }, 
    delete : (request, response, next) => {
        let userId = new mongoose.Types.ObjectId(request.params.id);
        User.findByIdAndRemove(userId)
        .then( () => {
            console.log('user fetched...');
            response.locals.redirect = '/users';
            next();
        })
        .catch( error => {
            console.log(`Error deleting user by id (deleting error) : ${error.message}`);
            next(error);
        });
    }, 
    login : (request, response) => {
        response.render('users/login');
    }, 
    authenticate : passport.authenticate('local', {
        failureRedirect : '/users/login', 
        failureFlash : 'Failed to login', 
        successRedirect : '/', 
        successFlash : 'Logged in'
    }),
    //(request, response) => {
    //     User.findOne({
    //         email : request.body.email
    //     }).then((user) => {
    //         if(user) {
    //             user.passwordComparison(request.body.password)
    //             .then(passwordMatch => {
    //                 if(passwordMatch) {
    //                     request.flash('success', `${user.fullName}'s successfully logged in!`);
    //                     response.locals.redirect = `/users/${user._id}`;
    //                     response.locals.user = user;
    //                 } else {
    //                     request.flash('error', `Fail to login user account : IncorrectPassword`);
    //                     response.locals.redirect = '/users/login';
    //                 }
    //                 next();
    //             })
    //         } else {
    //             request.flash('error', 'Failed to login user : User account not found!');
    //             response.locals.redirect = '/users/login';
    //             next();
    //         }
            // if(user && user.password === request.body.password) {
            //     response.locals.redirect = `/users/${user._id}`;
            //     request.flash("success", `${user.fullName}'s is logged in successfully! `);
            //     next();
            // } else {
            //     response.locals.redirect = '/users/login';
            //     request.flash("error", `Your account or password is incorrect.Please try again or contact your system administrator!`);
            //     next();
            // }
    //     }).catch(error => {
    //         console.log(`Error logging in user : ${error.message}`);
    //         next(error);
    //     });
    // }, 
    validate : (request, response, next) => {
        request.sanitizeBody('email').normalizeEmail({
            all_lowercase : true
        }).trim();
        request.check('email', 'Email is invalid').isEmail();
        request.check('zipCode', 'Zip code is invalid').notEmpty().isInt().isLength({
            min: 5, 
            max : 5
        }).equals(request.body.zipCode);
        request.check('password', 'password cannot be empty').notEmpty();
        request.getValidationResult().then((error) => {
            if(!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                request.skip = true;
                request.flash('error', messages.join(' and '));
                response.locals.redirect='/users/new';
                next();
            } else {
                next();
            }
        });
    },
    logout : (request, response, next) => {
        request.logout();
        request.flash('success', 'You have been logged out');
        response.locals.redirect = '/';
        next();
    }, 
    verifyToken : (request, response, next) => {
        let token = request.query.apiToken;
        if(token) {
            User.findOne({apiToken : token})
            .then(user => {
                if(user) next();
                else next(new Error("No user Or Invalid API Token."));
            }).catch(error => {
                next(new Error(error.message));
            });
        } else {
            next(new Error("Invalid API Token."));
        }
    },
};


/*
module.exports = {
    index : (request, response) => {
        User.find({})
        .then((users) => {
            response.render('user/index', {
                users : users
            })
        })
        .catch((error) => {
            console.log(`Error fetching users : ${error.message}`);
            response.redirect('/');
        });
    }
};
*/