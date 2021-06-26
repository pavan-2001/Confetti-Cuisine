const Course = require('../models/course'), 
httpStatus = require('http-status-codes'), 
User = require('../models/user'),
getCourseParams = (body) => {
    return ({
        title : body.title, 
        description : body.description, 
        maxStudents : body.maxStudents, 
        cost : body.cost
    });
};

module.exports={
    index : (request, response, next) => {
        Course.find()
        .then(courses => {
            response.locals.courses = courses;
            next();
        }).catch(error => {
            console.log(`Error fetching courses : ${error.message}`);
            next(error);
        });
    },
    indexAction : (request, response) => {
        if(request.query.format === "json") {
            response.send(response.locals.courses);
        } else {
            response.render('courses/index');
        }
    }, 
    new : (request, response) => {
        response.render('courses/new');
    },
    create : (request, response, next) => {
        Course.create(getCourseParams(request.body))
        .then(course => {
            response.locals.redirect = '/courses';
            next();
        }).catch(error => {
            console.log(`Error creating course : ${error.message}`);
            next(error);
        });
    },
    redirectView : (request, response) => {
        const redirectPath = response.locals.redirect;
        if(redirectPath) response.redirect(redirectPath);
        else response.render('error');
    },
    show : (request, response, next) => {
        let courseId = request.params.id;
        Course.findById(courseId)
        .then(course => {
            response.locals.course = course;
            next();
        }).catch(error => {
            console.log(`Error fetching course by id : ${error.message}`);
            next(error);
        });
    }, 
    showView : (request, response) => {
        response.render('courses/show');
    }, 
    edit : (request, response, next) => {
        let courseId= request.params.id;
        Course.findById(courseId)
        .then(course => {
            response.render('courses/edit', {
                course : course
            });
        }).catch(error => {
            console.log(`Error fetching course by id : ${error.message}`);
            next(error);
        });
    },
    update : (request, response, next) => {
        let courseId= request.params.id;
        let courseParams = getCourseParams(request.body);
        Course.findByIdAndUpdate(courseId, {
            $set : courseParams
        }).then(course => {
            response.locals.course = course;
            response.locals.redirect = `/courses/${courseId}`;
            next();
        }).catch(error => {
            console.log(`Error updating course by id : ${error.message}`);
            next(error);
        });
    }, 
    delete : (request, response, next) => {
        let courseId= request.params.id;
        Course.findByIdAndDelete(courseId)
        .then(() => {
            response.locals.redirect = '/courses';
            next();
        }).catch(error => {
            console.log(`Error deleting course by id : ${error.message}`);
            next(error);
        });
    }, 
    respondJSON : (request, response) => {
        response.json({
            status : httpStatus.OK, 
            data : response.locals
        });
    },
    errorJSON : (error, request, response, next) => {
        let errorObject;
        if(error) {
            errorObject = {
                status : httpStatus.INTERNAL_SERVER_ERROR, 
                message : error.message
            };
        } else {
            errorObject = {
                status : httpStatus.INTERNAL_SERVER_ERROR, 
                message : "Unknown Error."
            };
        }

        response.json(errorObject);
    }, 
    join : (request, response, next) => {
        let courseId = request.params.id, 
        currentUser = request.user;

        if(currentUser) {
            User.findByIdAndUpdate(currentUser, {
                $addToSet : {
                    courses : courseId
                }
            }).then(() => {
                response.locals.success = true;
                next();
            }).catch(error => {
                next(error);
            });
        } else {
            next(new Error("User must log in."));
        }
    }, 
    filterUserCourses : (request, response, next) => {
        let currentUser = response.locals.currentUser;
        if(currentUser) {
            let mappedCourses = response.locals.courses.map((course) => {
                let userJoined = currentUser.courses.some((userCourse) => {
                    return userCourse.equals(course._id);
                });
                return Object.assign(course.toObject(), {joined : userJoined});
            });
            response.locals.courses = mappedCourses;
            next();
        } else {
            next();
        }
    }
};