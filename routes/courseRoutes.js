const router = require('express').Router(), 
courseController = require('../controllers/courseController');

router.get('/', courseController.index, courseController.indexAction);

router.get('/new', courseController.new);

router.post('/create', courseController.create, courseController.redirectView);

router.get('/:id/edit', courseController.edit);

router.put('/:id/update', courseController.update, courseController.redirectView);

router.get('/:id', courseController.show, courseController.showView);

router.delete('/:id/delete', courseController.delete, courseController.redirectView);

module.exports = router;