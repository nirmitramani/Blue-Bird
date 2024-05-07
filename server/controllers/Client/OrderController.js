const Order = require("../../schema/Client/OrderSchema");
const OrderItem = require("../../schema/Client/OrderItemSchema");
const PaymentDetail = require("../../schema/Client/PaymentDetailSchema");
const constant = require("../../config/Constant");
const User = require("../../schema/Client/UserSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.index = async (req, res) => {
  try {
    // Fetch orders along with their related items and payment details
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_ORDER_DATA_SUCCESSFULLY,
      data: orders,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.store = async (req, res) => {
  try {
    const {
      userToken,
      couponId,
      discountAmount,
      orderDate,
      paymentType,
      products,
      totalAmount,
      onlinPaymentId,
      onlineOrderId,
      paymentStatus,
      address,
      city,
      state,
      country,
      postcode,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one product must be included in the order.",
      });
    }

    for (const product of products) {
      if (!product.productId || !product.quantity || product.quantity <= 0) {
        return res.status(400).json({
          status: false,
          message:
            "Each product must have a valid productId and a quantity greater than 0.",
        });
      }
    }

    const updateData = {
      address: address ? address.trim() : "",
      city: city ? city.trim() : "",
      state: state ? state.trim() : "",
      country: country ? country.trim() : "",
      postcode: postcode ? postcode.trim() : "",
    };

    const updatedUser = await User.findOneAndUpdate(
      { token: userToken },
      updateData,
      { new: true }
    );

    const userId = updatedUser._id;

    const OrderData = {
      userId: userId,
      couponId: couponId ? couponId.trim() : "",
      discountAmount: discountAmount ? discountAmount : "",
      orderDate: orderDate ? orderDate : "",
      paymentType: paymentType,
    };

    const createdOrder = await Order.create(OrderData);
    const orderId = createdOrder._id;

    const orderItems = products.map((product) => {
      return {
        orderId: orderId,
        productId: product.productId ? product.productId : "",
        quantity: product.quantity ? product.quantity : "",
        amount: product.amount ? product.amount : "",
        size: product.size ? product.size : "",
      };
    });
    const orderItem = await OrderItem.insertMany(orderItems);

    const PaymentData = {
      orderId: orderId,
      totalAmount: totalAmount,
      onlinPaymentId: onlinPaymentId ? onlinPaymentId : "",
      onlineOrderId: onlineOrderId ? onlineOrderId : "",
      paymentStatus: paymentStatus ? paymentStatus.trim() : "",
    };
    const orderPayment = await PaymentDetail.create(PaymentData);

    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_ORDER_ADD_SUCCEESFULL,
      data: {
        createdOrder: createdOrder,
        orderItem: orderItem,
        orderPayment: orderPayment,
      },
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const getOrder = await Order.findById(req.params.id);
    const getOrderItem = await OrderItem.find({ orderId: req.params.id });
    const getPaymentDetail = await PaymentDetail.findOne({
      orderId: req.params.id,
    });

    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_GET_ORDER_DATA_SUCCESSFULLY,
      data: {
        order: getOrder,
        orderItem: getOrderItem,
        paymentDetail: getPaymentDetail,
      },
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    const orderItem = await OrderItem.insertMany(deletedOrder.orderId);
    const orderPayment = await Order.create(deletedOrder.orderId);

    if (!deletedOrder) {
      res.json({ status: false, message: constant.MSG_FOR_ORDER_NOT_FOUND });
    } else {
      res.status(200).json({
        status: true,
        message: constant.MSG_FOR_ORDER_DELETE_SUCCEESFULL,
      });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.statusChnage = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  Order.findByIdAndUpdate(orderId, { status })
    .then((updatedOrder) => {
      res.json({ status: true, updatedOrder: updatedOrder });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: false, error: "Failed to update status" });
    });
};

exports.counts = async (req, res) => {
  try {
    const count = await Order.countDocuments({});
    res.json({ status: true, count: count }); 
  } catch (error) {
    res.status(500).json({ status: false, error: "Could not count orders" });
  }
};

exports.genrateOrderId = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    var options = req.body;
    const order = await instance.orders.create(options);

    if (order) {
      res.json({ status: true, order: order });
    }else{
      res.status(500).json({ status: false, error: "Order Id Not Created"});
    }
  } catch (error) {
    res.status(500).json({ status: false, error: "Somthing went Wrong." });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    console.log(razorpay_payment_id);
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sh.digest("hex");

    if(digest !== razorpay_signature){
      res.status(400).json({ status: false, error: "Payment is not verified." });
    }else{
      res.json({ status: true, orderid: razorpay_order_id, paymentid: razorpay_payment_id });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: "Somthing went Wrong." });
  }
};
