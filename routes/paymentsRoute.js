const express = require('express');
const router = express.Router();
const auth = require('../middlewares/index');
const paymentController = require('../controllers/paymentsController');
router.post('/checkout',auth.isAuthenticated('Active', 'Pending', 'Verified'),paymentController.checkoutSession);
module.exports = router;