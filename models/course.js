const mongoose = require('mongoose'), 
{ Schema } = mongoose, 
courseSchema = new Schema({
    title : {
        type : String, 
        required : true, 
        unique : true
    }, 
    description : {
        type : String, 
        required : true
    }, 
    maxStudents : {
        type : Number, 
        default : 0, 
        min : [0, 'Course cannot have negative number of students']
    }, 
    cost : {
        type : Number, 
        default : 0, 
        min : [0, 'Course cannot have negative cost']
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('Course', courseSchema);



























// const mongoose = require('mongoose');

// const courseSchema = mongoose.Schema({
//     title : {
//         type : String, 
//         required : true, 
//         unique : true,
//     }, 
//     description : {
//         type : String, 
//         required : true
//     }, 
//     items : [], 
//     zipCode : {
//         type : Number, 
//         min : [10000, "zip code is too short"], 
//         max : [999999, 'zip code is too long']
//     }
// }); 

// module.exports = mongoose.model('Courses', courseSchema);