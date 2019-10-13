const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');

router.get('/current', auth, tenantController.getCurrentTenant);
router.post('/create', tenantController.createTenant);

module.exports = router;