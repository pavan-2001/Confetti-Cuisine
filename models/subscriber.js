const mongoose = require('mongoose'), 
{ Schema } = mongoose, 
subscriberSchema = new Schema({
    name : {
        type : String, 
        required : true
    }, 
    email : {
        type : String, 
        required : true, 
        lowercase : true, 
        unique : true
    }, 
    zipCode : {
        type : Number, 
        min : [10000, 'Zip Code is too short'], 
        max : [99999, 'Zip Code is too large']
    }, 
    courses : [{type : Schema.Types.ObjectId, ref : 'Course'}], 
}, {
    timestamps : true
});

subscriberSchema.methods.getInfo = function() {
    return `Name : ${this.name} Email : ${this.email} Zip Code : ${this.zipCode}`
};

module.exports = mongoose.model('Subscriber', subscriberSchema);
























// const mongoose = require('mongoose');

// const  subscriberSchema = new mongoose.Schema({
//     name : {
//         type : String, 
//         required : true
//     }, 
//     email : {
//         type : String, 
//         required : true, 
//         unique : true, 
//         lowercase : true
//     }, 
//     zipCode : {
//         type : Number, 
//         min : [10000, "zip code is too short"], 
//         max : [99999, "zip code is too large"]
//     }, 
//     courses : [{type : mongoose.Schema.Types.ObjectId , ref : 'Course'}]
// });

// subscriberSchema.methods.getInfo = function() {
//     return (`Name : ${this.name} Email : ${this.email} Zip code : ${this.zipCode}`);
// };

// subscriberSchema.methods.findLocalSubscribers = function() {
//     return (this.model('Subscriber').find({zipCode : this.zipCode})
//     .exec());
// };

// module.exports = mongoose.model('Subscribers', subscriberSchema);


// const mongoose = require('mongoose'), 
// subscriberSchema = mongoose.Schema({
//     name : String, 
//     email : String, 
//     zipCode : Number
// });

// module.exports = mongoose.model('Subscribers', subscriberSchema);