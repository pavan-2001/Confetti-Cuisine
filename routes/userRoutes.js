const router = require('express').Router(), 
userController = require('../controllers/userController');

router.get('/', userController.index, userController.indexView);

router.get('/new', userController.new);

router.post('/create', userController.validate, userController.create, userController.redirectView);

router.get('/login', userController.login);

router.post('/login', userController.authenticate);

router.get('/logout', userController.logout, userController.redirectView);

router.get('/:id/edit', userController.edit);

router.put('/:id/update', userController.update, userController.redirectView);

router.get('/:id', userController.show, userController.showView);

router.delete('/:id/delete', userController.delete, userController.redirectView);

module.exports = router;