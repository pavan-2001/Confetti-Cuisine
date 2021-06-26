const mongoose = require('mongoose'), 
passportLocalMongoose = require('passport-local-mongoose'),
{ Schema } = mongoose, 
randToken = require('rand-token'), 
Subscriber = require('./subscriber'), 
userSchema = new Schema({
    name : {
        first : {
            type : String, 
            trim : true
        }, 
        last : {
            type : String, 
            trim : true
        }
    }, 
    email : {
        type : String, 
        required : true, 
        unique : true
    }, 
    zipCode : {
        type : Number, 
        min : [10000, 'Zip Code is too short'], 
        max : [99999, 'Zip Code is too large']
    }, 
    courses : [
        {
            type : Schema.Types.ObjectId, 
            ref : 'Course'
        }
    ], 
    subscribedAccount : {
        type : Schema.Types.ObjectId, 
        ref : 'Subscriber'
    }, 
    apiToken : {
        type : String
    }
}, {
    timestamps : true
});

userSchema.virtual('fullName').get(function() {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function(next) {
    let user = this;
    if(!user.apiToken) user.apiToken = randToken.generate(16);
    next();
});

userSchema.pre('save', function(next) {
    let user = this;
    if(user.subscribedAccount === undefined) {
        Subscriber.findOne({email : user.email})
        .then( (subscriber) => {
            user.subscribedAccount = subscriber;
            next();
        })
        .catch( (error) => {
            console.log(`Error in connecting subscriber : ${error.message}`);
            next(error);
        });
    } else {
        next();
    }
});

// userSchema.pre('save', function(next) {
//     let user = this;
//     bcrypt.hash(user.password, 10)
//     .then(hash => {
//         user.password = hash;
//         next();
//     }).catch(error => {
//         console.log(`Error in hashing password : ${error.message}`);
//         next(error);    
//     });
// });

// userSchema.methods.passwordComparison = function(inputPassword) {
//     let user = this;
//     return bcrypt.compare(inputPassword, user.password);
// };

userSchema.plugin(passportLocalMongoose, {
    usernameField : 'email'
});

module.exports = mongoose.model('User', userSchema);























// const mongoose = require('mongoose'), 
// Subscriber = require('./subscriber');

// const userSchema = mongoose.Schema({
//     name : {
//         first :{
//             type : String, 
//             trim : true , 
//             required : true 
//         }, 
//         last : {
//             type : String, 
//             trim : true, 
//             required : true
//         }
//     }, 
//     email : {
//         type : String, 
//         required : true, 
//         lowercase : true,
//         unique : true
//     }, 
//     zipCode :{
//         type : Number, 
//         min : [ 10000, 'Zip Code is too short'], 
//         max : [ 99999, 'Zip Code is too long']
//     }, 
//     password : {
//         type: String, 
//         required : true
//     },
//     courses : [{type : mongoose.Schema.Types.ObjectId, ref : 'Courses'}], 
//     subscribedAccount : {type : mongoose.Schema.Types.ObjectId, ref : 'Subscribers'},
// }, {timestamps : true});

// userSchema.pre('save', function(next) {
//     let user = this;
//     if(user.subscribedAccount === undefined) {
//         Subscriber.findOne({
//             email : user.email
//         })
//         .then(subscriber => {
//             user.subscribedAccount = subscriber;
//             next();
//         })
//         .catch(error => {
//             console.log(`Error fetching Subscriber : ${error.message}`);
//             next(error);
//         });
//     } else {    
//         next();
//     }
// });

// userSchema.virtual('fullName').get(function() {
//     return (`${this.name.first} ${this.name.last}`);
// });

// module.exports = mongoose.model('Users', userSchema);