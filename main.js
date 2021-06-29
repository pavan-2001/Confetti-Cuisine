const user = require('./models/user');

const express = require('express'), 
app = express(), 
layouts = require('express-ejs-layouts'), 
mongoose = require('mongoose'), 
methodOverride = require('method-override'),
router = require('./routes/index'), 
expressSession = require('express-session'), 
cookieParser = require('cookie-parser'), 
connectFlash = require('connect-flash'), 
expressValidator = require('express-validator'), 
passport = require('passport'), 
User = require('./models/user'), 
connectEnsureLogin = require('connect-ensure-login');

mongoose.connect( process.env.MONGODB_URI ||
    'mongodb://localhost:27017/recipe_db',
    {useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false}
);

const db = mongoose.connection;

db.once('open', () => {
    console.log('Successfully connected to MongoDB using mongoose...');
});

mongoose.Promise = global.Promise;

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');

app.set('token', process.env.TOKEN || "recipeT0K3N");

app.use(express.static('public'));

app.use(methodOverride('_method', {
    methods : ['POST', 'GET']
}));

app.use(express.urlencoded({
    extended : true
}));

app.use(express.json());

app.use(layouts);

app.use(cookieParser('secretCuisine123'));

app.use(expressSession({
    secret : 'secretCuisine123', 
    cookie : {
        maxAge : 4000000
    }, 
    resave : false, 
    saveUninitialized : false
}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());

app.use((request, response, next) => {
    response.locals.flashMessages = request.flash();
    response.locals.loggedIn = request.isAuthenticated();
    response.locals.currentUser = request.user;
    next();
});

app.use(expressValidator());

app.use('/', router);

const server = app.listen(app.get('port'), () => {
    console.log(`Server has started and is listening on port : ${app.get('port')}`);
}), 
io = require("socket.io")(server);

const chatController = require('./controllers/chatController')(io);