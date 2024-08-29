const Sale = require('../Models/sale');
const Product = require('../Models/product');
const Order = require('../Models/order');
const mongoose = require('mongoose');

// Fetch the details of a specific sale
async function getSaleDetails(req, res){
    const saleId = req.params.id;

    try {

        // Find the sale by ID and populate product details
        const sale = await Sale.findById(saleId).populate('product');

        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        // Return sale details
        res.status(200).json({
            saleId: sale._id,
            product: sale.product.name,
            price: sale.product.price,
            availableStock: sale.product.stock,
            startTime: sale.startTime,
            endTime: sale.endTime
        });


    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching sale details' });
    }
};

async function createProduct  (req, res)  {
    const { name, price, stock } = req.body;

    try {
        const product = new Product({ name, price, stock });
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
async function createSale  (req, res)  {
    const { productId, quantity, startTime, endTime } = req.body;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create a new sale
        const sale = new Sale({ product: productId, quantity, startTime, endTime });
        await sale.save();
        res.status(201).json({ message: 'Sale created successfully', sale });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


async function placeOrder (req, res){
    const { userId, productId, quantity } = req.body;
    const maxQuantityPerUser = 10; // Set the maximum quantity a user can order

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the product by ID within the session
        const product = await Product.findById(productId).session(session);

        if (!product) {
            throw new Error('Product not found');
        }

        // Check if the requested quantity exceeds the stock
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        // Check if the user has already placed an order for this product and how many
        const existingOrders = await Order.find({ user: userId, product: productId }).session(session);
        const totalOrderedByUser = existingOrders.reduce((sum, order) => sum + order.quantity, 0);

        if (totalOrderedByUser + quantity > maxQuantityPerUser) {
            throw new Error(`You can only order up to ${maxQuantityPerUser} of this item.`);
        }

        // Update product stock
        product.stock -= quantity;
        await product.save({ session });

        // Create a new order
        const order = new Order({
            user: userId,
            product: productId,
            quantity,
            status: 'Success',
            orderTime: new Date()
        });
        await order.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};


module.exports = { getSaleDetails, placeOrder, createProduct, createSale }