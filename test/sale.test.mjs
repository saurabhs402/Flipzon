
import chai from "chai"
import chaiHttp from "chai-http";
import server from "../app.js";

// const chai = require('chai');
// const chaiHttp = require('chai-http');
import User from '../Models/user.js'
import Product from '../Models/product.js';
import Sale from '../Models/sale.js';
import Order from '../Models/order.js';
import mongoose from 'mongoose'

chai.should();
chai.use(chaiHttp);

describe('Flash Sale API', function () {
    this.timeout(20000);
    let token;
    let productId;
    let saleId;

    // Setup: Create a user and a product, and obtain an authentication token
    before(async function () {
        this.timeout(20000);

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect("mongodb+srv://saurabh:n5Xdz6QMNgfyxx1b@cluster0.o1ude.mongodb.net/sale-db?retryWrites=true&w=majority&appName=Cluster0", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000,
            });
        }
        await User.deleteMany({});
        await Product.deleteMany({});
        await Sale.deleteMany({});
        await Order.deleteMany({});
       

        const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
        await user.save();

        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        token = res.body.token;

        const product = new Product({ name: 'iPhone', price: 1000, stock: 1000 });
        await product.save();
        productId = product._id;

        const sale = new Sale({ product: productId, startTime: new Date(), endTime: new Date(Date.now() + 1000 * 60 * 60) });
        await sale.save();
        saleId = sale._id;
    });

    // Test the sale details endpoint
    describe('GET /api/sale/:id', () => {
        it('should get sale details', (done) => {
            chai.request(server)
                .get(`/api/sale/${saleId}`)
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('saleId');
                    res.body.should.have.property('product');
                    done();
                });
        });
    });

    // Test the place order endpoint
    describe('POST /api/sale/:id/order', () => {
        it('should place an order', (done) => {
            chai.request(server)
                .post(`/api/sale/${saleId}/order`)
                .set('Authorization', token)
                .send({ productId, quantity: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Order placed successfully');
                    done();
                });
        });

        it('should not place an order with insufficient stock', (done) => {
            chai.request(server)
                .post(`/api/sale/${saleId}/order`)
                .set('Authorization', token)
                .send({ productId, quantity: 1001 })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error').eql('Insufficient stock');
                    done();
                });
        });
    });
});
