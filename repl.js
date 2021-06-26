const mongoose = require('mongoose'), 
Course = require('./models/course'), 
Subscriber = require('./models/subscriber'), 
User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/recipe_db', {
    useNewUrlParser : true, 
    useUnifiedTopology : true
});

mongoose.promise = global.promise;

// variables to hold test values
var testSubscriber, testCourse, testUser;


Course.remove({})
.then((items) => {
    console.log(`Successfully removed ${items.n} entries from Course...`);
    return Subscriber.remove({});
})
.then((items) => {
    console.log(`Successfully removed ${items.n} entries from Subscriber...`);
    return User.remove({});
})
.then((items) => {
    console.log(`Successfully removed ${items.n} entries from User...`);
})
.then(() => {
    return Subscriber.create({
        name : 'Jon', 
        email : 'jon@jonwexler.com', 
        zipCode : 12342
    });
})
.then((subscriber) => {
    console.log(`Created new subscriber: ${subscriber.name}`);
    return Subscriber.create({
       name : 'Pavan', 
       email : 'apavank71@gmail.com', 
       zipCode : 12345 
    });
})
.then((subscriber) => {
    console.log(`Created new subscriber: ${subscriber.name}`);
    return Subscriber.findOne({name : 'Jon'});
})
.then((subscriber) => {
    testSubscriber = subscriber ; 
    console.log(subscriber.getInfo());
    return Course.create({
        title : 'Tomato Land', 
        description : 'Locally farmed tomatoes', 
        items : ['cherry', 'heirloom'], 
        zipCode : 12345
    });
})
.then((course) => {
    testCourse = course;
    console.log(`Created new course : ${course.title}`);
})
.then(() => {
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
})
.then(() => {
    return Subscriber.populate(testSubscriber, 'courses');
})
.then((subscriber) => {
    console.log(subscriber);
    return Subscriber.find({});
})
.then((subscribers) => {
    console.log(subscribers);
    return User.create({
        name : {
            first : 'Pavan', 
            last : 'Kumar'
        }, 
        email : 'apavank71@gmail.com', 
        password : 'Pavan71Kumar@', 
        zipCode : 12345
    });
})
.then((user) => {
    console.log(`Created new user : ${user.fullName}`);
    testUser = user;
    return User.create({
        name : {
            first : 'Jon', 
            last : 'wexler'
        }, 
        email : 'jon@jonwexler.com', 
        password : 'jon123', 
        zipCode : 12365
    });
})
.then((user) => {
    console.log(`Created new user : ${user.fullName}`);
    return Subscriber.findOne({email : testUser.email});
})
.then((subscriber) => {
    testUser.subscribedAccount = subscriber;
    testUser.save().then(() => console.log('User Updated...'));
})
.catch((error) => console.log(error.message));