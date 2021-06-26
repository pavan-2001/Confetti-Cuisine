// const subscriber = require('./models/subscriber');
// const user = require('./models/user');

const express = require('express'), 
app = express(), 
layouts = require('express-ejs-layouts'), 
homeController = require('./controllers/homeController'), 
errorController = require('./controllers/errorController'),
mongoose = require('mongoose'), 
Subscriber = require('./models/subscriber'), 
subscribersController = require('./controllers/subscribersController'), 
courseController = require('./controllers/courseController'),
userController = require('./controllers/userController'),
methodOverride = require('method-override'),
router = express.Router(), 
expressSession = require('express-session'), 
cookieParser = require('cookie-parser'), 
connectFlash = require('connect-flash');

mongoose.connect(
    'mongodb://localhost:27017/recipe_db',
    { useNewUrlParser : true, useUnifiedTopology : true}
);

const db = mongoose.connection;

db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose...!');
});

mongoose.Promise = global.Promise ;

app.use('/', router);

// Subscriber.create({
//     name : 'Sona Nathan', 
//     email : 'sonanathan@gmail.com'
// }, (error, savedDocument) => {
//     if(error) console.log(error);
//     console.log(savedDocument);
// });

// Subscriber.create({
//     name : 'Pavan kumar', 
//     email : 'apavank71@gmail.com'
// }, (error, savedDocument) => {
//     if(error) console.log(error);
//     console.log(savedDocument);
// });

// Subscriber.create({
//     name : 'Jon Wexler',
//     email : 'jon@jonwexler.com'
// }, (error, savedDocument) => {
//     if(error) console.log(error);
//     console.log(savedDocument);
// });

// var myQuery = Subscriber.findOne({ name : 'Jon Wexler'}).where('email', /wexler/);

// myQuery.exec((error, data) => {
//     if(data) console.log(data.name);
// });

// MongoDB = require('mongodb').MongoClient, 
// dbURL = 'mongodb://localhost:27017', 
// dbName = 'recipe_db';

// MongoDB.connect(dbURL, (error, client) => {
//     if(error) throw error ;
//     let db = client.db(dbName);
//     db.collection('Users').insertOne({
//         name : 'Pavan Kumar', 
//         email : 'apavank71@gmail.com'
//     }, (error, db) => {
//         if(error) throw error;
//         console.log(db);
//     });
//     db.collection('Users').find().toArray((error, data) => {
//         if(error) throw error;
//         console.log(data);
//     });
// });

// const subscriberSchema = mongoose.Schema({
//     name : String, 
//     email : String
// });

// const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// var subscriber1 = new Subscriber({
//     name : 'Pavan Kumar', 
//     email : 'apavank71@gmail.com'
// });

// subscriber1.save((error, savedDocument) => {
//     if(error) console.log(error);
//     console.log(savedDocument);
// });

// Subscriber.create({
//     name : 'Ankit Chappri', 
//     email : 'ankitchappri@gmail.com'
// }, (error, savedDocument) => {
//     if(error) console.log(error);
//     console.log(savedDocument);
// });

//app.use(express.static('public'));

app.set("port", process.env.PORT || 3000);

router.use(express.static('public'));

router.use(methodOverride('_method', {
    methods : ['POST', 'GET']
}));

// app.use(express.urlencoded({
//     extended : false
// }));

router.use(express.urlencoded({
    extended : false
}));


router.use(cookieParser("secret_passcode"));

router.use(expressSession({
    secret : "secret_passcode", 
    cookie : {
        maxAge : 4000
    }, 
    resave : false, 
    saveUninitialized : false
}));

router.use(connectFlash());

router.use((request, response, next) => {
    response.locals.flashMessages = request.flash();
    next();
}); 

//app.use(express.json());
router.use(express.json());

app.set('view engine', 'ejs');
    
//app.use(layouts);
router.use(layouts);

router.get('/subscribers', subscribersController.index, subscribersController.indexAction);

router.get('/subscribers/new', subscribersController.new);

router.post('/subscribers/create', subscribersController.create, subscribersController.redirectView);

router.get('/subscribers/:id', subscribersController.show, subscribersController.showView);

router.get('/subscribers/:id/edit', subscribersController.edit);

router.put('/subscribers/:id/update', subscribersController.update, subscribersController.redirectView);

router.delete('/subscribers/:id/delete', subscribersController.delete, subscribersController.redirectView);

router.get('/courses', courseController.index, courseController.indexAction);

router.get('/courses/new', courseController.new);

router.post('/courses/create', courseController.create, courseController.redirectView);

router.get('/courses/:id', courseController.show, courseController.showView);

router.get('/courses/:id/edit', courseController.edit);

router.put('/courses/:id/update', courseController.update, courseController.redirectView);

router.delete('/courses/:id/delete', courseController.delete, courseController.redirectView);

router.get('/users', userController.index, userController.indexAction);

router.get('/users/new', userController.new);

router.post('/users/create', userController.create, userController.redirectView);

router.get('users/:id', userController.show, userController.showView);

router.get('/users/:id/edit', userController.edit);

router.put('/users/:id/update', userController.update, userController.redirectView);

router.delete('/users/delete', userController.delete, userController.redirectView);

router.get('/users/login', userController.login);

router.post('/users/login', userController.authenticate, userController.redirectView);

/*
router.get('/', homeController.showHomePage);

router.get('/subscribers/new', subscribersController.new);

router.post('/subscribers/create', subscribersController.create, subscribersController.redirectView);

router.put('/subscriber/:id/update');

router.get('/subscribers', subscribersController.index, subscribersController.indexAction);

router.get('/subscribers/:id', subscribersController.show, subscribersController.showView);

router.get('/subscribers/:id/edit', (request, response) => {
    response.render('subscribers/edit', {
        subscriber : request.params.id
    });
})

router.get('/courses', courseController.showCourses);

router.get('/users', userController.index, userController.indexAction);

router.get('/users/new', userController.new);

router.post('/users/create', userController.create, userController.redirectView);

router.get('/user/:id', userController.show, userController.showView);

router.get('/user/:id/edit', userController.edit);

router.put('/user/:id/update', userController.update, userController.redirectView);

router.delete('/user/:id/delete', userController.delete, userController.redirectView);

router.get('/thanks', (request, response) => {
    response.render('thanks');
});
*/

//app.get('/contact', homeController.showSignUp);

//app.post('/contact', homeController.postedSignUpForm);

router.use(errorController.pageNotFoundError);

router.use(errorController.internalServerError);

app.listen(app.get('port'), () => {
    console.log(`Server has started and is listening on port : ${app.get("port")}`);
});
