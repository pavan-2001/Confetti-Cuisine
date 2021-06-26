const Subscriber = require('../models/subscriber');

module.exports = {
    index : (request, response, next) => {
        Subscriber.find()
        .then(subscribers => {
            response.locals.subscribers = subscribers;
            next();
        })
        .catch(error => {
            console.log(`Error fetching subscribers : ${error}`);
            response.redirect('/');
        });
    },
    indexAction : (request, response) => {
        response.render('subscribers/index');
    },
    new : (request, response) => {
        response.render('subscribers/new');
    },
    create : (request, response, next) => {
        Subscriber.create({
            name : request.body.name, 
            email : request.body.email, 
            zipCode : request.body.zipCode
        }).then(subscriber => {
            response.locals.redirect = '/subscribers';
            response.locals.subscriber = subscriber ;
            next();
        }).catch(error => {
            console.log(`Error creating subscriber : ${error.message}`);
            next(error);
        });
    }, 
    redirectView : (request, response) => {
        let redirectPath = response.locals.redirect;
        if(redirectPath) response.redirect(redirectPath);
        else response.render('error'); 
    }, 
    show : (request, response, next) => {
        let subscriberId = request.params.id ;
        Subscriber.findById(subscriberId)
        .then(subscriber => {
            response.locals.subscriber = subscriber;
            next();
        })
        .catch(error => {
            console.log(`Error fetching Subscriber with id : ${subscriberId}`);
            next(error);
        });
    }, 
    showView : (request, response) => {
        response.render('subscribers/show');
    }, 
    edit : (request, response, next) => {
        let subscriberId = request.params.id;
        Subscriber.findById(subscriberId) 
        .then( (subscriber) => {
            response.render('subscribers/edit', {
                subscriber : subscriber
            });
        })
        .catch((error) => {
            console(`Error fetching subscriber by id : ${error.message}`);
            next(error);
        });
    }, 
    update : (request, response, next) => {
        let subscriberParams = {
            name : request.body.name,
            email : request.body.email, 
            zipCode : request.body.zipCode
        };
        let subscriberId = request.params.id;
        Subscriber.findByIdAndUpdate(subscriberId, {
            $set : subscriberParams
        }).then((subscriber) => {
            response.locals.redirect = `/subscribers/${subscriberId}`;
            response.locals.subscriber = subscriber;
            next();
        })
        .catch((error) => {
            console.log(`Error updating user by id : ${error.message}`);
            next(error);
        });
    }, 
    delete : (request, response, next) => {
        let subscriberId = request.params.id;
        Subscriber.findByIdAndDelete(subscriberId)
        .then(() => {
            response.locals.redirect='/subscribers';
            next();
        }).catch(error => {
            console.log(`Error deleting subscriber by id : ${error.message}`);
            next(error);
        });
    }
};



// exports.getAllSubscribers = (request, response, next) => {
//     Subscribers.find({}, (error, subscribers) => {
//         if(error) next(error);
//         request.data = subscribers;
//         next();
//     });
// };
/*
exports.getAllSubscribers = (request, response) => {
    Subscribers.find({})
    .exec()
    .then((subscribers) => {
        response.render('subscribers', {
            subscribers : subscribers
        })
    })
    .catch((error) => {
        if(error) console.log(error);
        return [];
    })
    .then(() => {
        console.log('Promise completed : Displayed All Subscribers');
    });
};

exports.getSubscribersPage = (request, response) => {
    response.render('contact');
};

exports.saveSubscribers = (request, response) => {
    Subscribers.create({
        name : request.body.name, 
        email : request.body.email, 
        zipCode : request.body.zipCode
    }).then(result => {
        response.render('thanks');
    }).catch((error) => {
        if(error) response.send(error);
    });
};
*/
// exports.saveSubscribers = (request, response) => {
//     Subscribers.create({
//         name : request.body.name, 
//         email : request.body.email, 
//         zipCode : request.body.zipCode
//     }, (error, savedDocument) => {
//         if(error) response.send(error);
//         response.render('thanks');
//     });
// };