const express = require('express');
const router = express.Router();
const auth = require('../middlewares/index');
const paymentController = require('../controllers/paymentsController');
router.post('/checkout'/*,auth.isAuthenticated(['active', 'pending', 'verified'])*/,paymentController.checkoutSession);
module.exports = router;