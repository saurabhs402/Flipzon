const express = require('express');
const router = express.Router();
const saleController = require('../Controllers/saleController');
const authController=require('../Controllers/authController')


router.post('/product',authController.authenticateToken,saleController.createProduct);
router.post('/sale', authController.authenticateToken, saleController.createSale)
router.get('/sale/:id', authController.authenticateToken,saleController.getSaleDetails);
router.post('/order',authController.authenticateToken, saleController.placeOrder);

module.exports = router;
