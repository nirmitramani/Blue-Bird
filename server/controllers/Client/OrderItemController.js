const OrderItem = require('../../schema/Client/OrderItemSchema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getOrderItem = await OrderItem.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_ORDERITEM_DATA_SUCCESSFULLY,
            data: getOrderItem,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { orderId, productId, quantity, amount, size } = req.body;

        if (!orderId || !productId || !quantity || !amount || !size) {
            return res.status(400).json({
                status: false,
                message: "All fields are required.",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                status: false,
                message: "Quantity must be a positive value.",
            });
        }

        const OrderItemData = {
            orderId: orderId.trim(),
            productId: productId.trim(),
            quantity: quantity.trim(),
            size: size.trim(),
            amount: amount.trim(),
        };
        const createdOrderItem = await OrderItem.create(OrderItemData);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_ORDERITEM_ADD_SUCCEESFULL,
            data: createdOrderItem,
        });
    } catch (error) {
        console.log({ status: false, message: error.message });
        res.status(500).json({ status: false, message: error.message });
    }
};


exports.show = async (req, res) => {
    try {
        const getOrderItem = await OrderItem.findById(req.params.id);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_ORDERITEM_DATA_SUCCESSFULLY,
            data: getOrderItem,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrderItem = await OrderItem.findByIdAndDelete(id);
        if (!deletedOrderItem) {
            res.json({ status: false, message: constant.MSG_FOR_ORDERITEM_NOT_FOUND });
        } else {
            res.status(200).json({ status: true, message: constant.MSG_FOR_ORDERITEM_DELETE_SUCCEESFULL });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.statusChnage = (req, res) => {
    const faqId = req.params.id;
    const { status } = req.body;

    OrderItem.findByIdAndUpdate(faqId, { status })
        .then(updatedOrderItem => {
            res.json({status: true, updatedOrderItem: updatedOrderItem});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: false, error: 'Failed to update status' });
        });
};