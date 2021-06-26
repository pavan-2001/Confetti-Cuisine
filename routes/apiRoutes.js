const router = require("express").Router(), 
courseController = require("../controllers/courseController"), 
userController = require('../controllers/userController');

router.get("/courses", courseController.index,courseController.filterUserCourses, courseController.respondJSON);
router.get("/courses/:id/join", courseController.join, courseController.respondJSON);
router.use(courseController.errorJSON);

module.exports = router;