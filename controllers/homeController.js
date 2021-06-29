const courses = [
    {
        title : "Event Driven Cakes", 
        cost : 50
    }, 
    {
        title : 'Asynchronous Artichoke', 
        cost : 25
    }, 
    {
        title : "Objet Oriented Orange Juice", 
        cost : 10
    }
];

exports.showHomePage = (request, response) => {
    response.render('index');
};

exports.showCourses = (request, response) => {
    response.render('courses', {
        offeredCourses : courses
    });
} ;

exports.postedSignUpForm = (request, response) => {
    response.render('thanks');
};

exports.chat = (request, response) => {
    response.render('chat');
}