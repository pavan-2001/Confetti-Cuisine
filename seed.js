const mongoose = require('mongoose'), 
Subscribers = require('./models/subscriber'), 
User = require('./models/user');

mongoose.connect(
    'mongodb://localhost:27017/recipe_db', 
    {
        useNewUrlParser: true, useUnifiedTopology : true
    }
);

mongoose.connection;
 

const users = [
    {
        details : {
            name : {
                first : "Jon", 
                last : "Wexler"
            },
            email : 'jon@jonwexler.com', 
            zipCode : 10016, 
        },
        password : "jonwexler"
    }, {
        details : {
            name : {
                first : "Chef", 
                last : "Eggplant"
            },
            email : 'eggplant@recipeapp.com', 
            zipCode : 20331, 
        },
        password : 'chefeggplant'
    }, 
    {
        details : {
            name : {
                first : "Professor", 
                last : "Souffle"
            },
            email : 'souffle@recipeapp.com', 
            zipCode : 19103,
        },
        password : 'professorsouffle'
    }
];

User.deleteMany().exec().then(() => {
    console.log('User data is empty');
});

var commands = [];

users.forEach(user => {
    commands.push(User.register(user.details, user.password));
});

Promise.all(commands).then((r) => {
    console.log(r);
    mongoose.connection.close();
}).catch((error) => {
    console.log(`error : ${error.message}`);
});


// Subscribers.deleteMany()
// .exec()
// .then(() => {
//     console.log('Subscriber data is empty!');
// });

// var commands = [];

// contacts.forEach((c) => {
//     commands.push(Subscribers.create({
//         name : c.name, 
//         email : c.email, 
//         zipCode : c.zipCode
//     }));
// });

// Promise.all(commands)
// .then(r => {
//     console.log(r);
//     mongoose.connection.close();
// })
// .catch(error => {
//     console.log(`ERROR : ${error}`);
// });