const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/current', auth, userController.getCurrentUser);
router.post('/create', auth, userController.createUser);
router.get('/practitioners', auth, userController.getPractitioners);
router.get('/practitioners/one', auth, userController.getPractitionerById);
router.post('/appointment/create', auth, userController.createAppointment);
router.delete('/appointment/remove', auth, userController.removeAppointment);

module.exports = router;