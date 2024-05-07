const express = require('express');
require('dotenv').config();
require('./config/DatabseConnection');
const constant = require('./config/Constant');
const path = require('path')
const app = express();
const authRoutes = require('./routes/auth');
const slider = require('./routes/Admin/Slider');
const faqs = require('./routes/Admin/FAQs');
const ContactUs = require('./routes/Admin/ContactUs');
const product = require('./routes/Admin/Product');
const sale = require('./routes/Admin/Sale');
const productCategories = require('./routes/Admin/ProductCategory');
const CmsPage = require('./routes/Admin/CmsPage');
const user = require('./routes/Admin/User');
const order = require('./routes/Client/Order');
const orderItem = require('./routes/Client/OrderItem');
const paymentDetail = require('./routes/Client/PaymentDetail');
const couponCode = require('./routes/Admin/CouponCode');
const productStockAndSize = require('./routes/Admin/ProductStockAndSize');
const Review = require('./routes/Client/Review');
const cors = require('cors');
const cookieParser = require('cookie-parser');
 
// Define CORS options
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/slider', slider);
app.use('/faqs', faqs);
app.use('/product', product);
app.use('/sale', sale);
app.use('/contact-us', ContactUs);
app.use('/productCategory', productCategories);
app.use('/cms-pages', CmsPage);
app.use('/user', user);
app.use('/order', order);
app.use('/order-item', orderItem);
app.use('/payment-detail', paymentDetail);
app.use('/coupon-code', couponCode);
app.use('/product-stock-size', productStockAndSize);
app.use('/review', Review);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: constant.MSG_FOR_INTERNAL_SERVER_ERROR });
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

