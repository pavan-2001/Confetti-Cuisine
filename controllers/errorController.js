const httpStatus = require('http-status-codes');

exports.pageNotFoundError = (request, response) => {
    const errorCode = httpStatus.NOT_FOUND;
    response.status(errorCode);
    response.render('error');
};

exports.internalServerError = (error, request, response, next) => {
    const errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`Error : ${error.stack}`);
    response.status(errorCode);
    response.send(`${errorCode} | Sorry, our application is taking a nap!`);
};
