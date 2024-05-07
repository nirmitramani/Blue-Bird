const PaymentDetail = require('../../schema/Client/PaymentDetailSchema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getPaymentDetail = await PaymentDetail.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_PAYMENT_DETAIL_DATA_SUCCESSFULLY,
            data: getPaymentDetail,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { orderId, totalAmount, paymentType, onlinPaymentId, bankPaymentId } = req.body;

        if (!orderId || !totalAmount || !paymentType || !onlinPaymentId || !bankPaymentId) {
            return res.status(400).json({
                status: false,
                message: "All fields are required.",
            });
        }

        const PaymentDetailData = {
            orderId: orderId.trim(),
            totalAmount: totalAmount.trim(),
            paymentType: paymentType.trim(),
            onlinPaymentId: onlinPaymentId.trim(),
            bankPaymentId: bankPaymentId.trim(),
        };

        const createdPaymentDetail = await PaymentDetail.create(PaymentDetailData);

        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_PAYMENT_DETAIL_ADD_SUCCEESFULL,
            data: createdPaymentDetail,
        });
    } catch (error) {
        console.log({ status: false, message: error.message });
        res.status(500).json({ status: false, message: error.message });
    }
};


exports.show = async (req, res) => {
    try {
        const getPaymentDetail = await PaymentDetail.findById(req.params.id);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_PAYMENT_DETAIL_DATA_SUCCESSFULLY,
            data: getPaymentDetail,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const {orderId, totalAmount, paymentType, onlinPaymentId, bankPaymentId, status} = req.body;

    if (!orderId || !totalAmount || !paymentType || !onlinPaymentId || !bankPaymentId || !status) {
        return res.status(400).json({
            status: false,
            message: "All fields are required.",
        });
    }

    try {
        const updatedPaymentDetail = await PaymentDetail.findById(id);

        if (!updatedPaymentDetail) {
            return res.json({ status: false, message: constant.MSG_FOR_PAYMENT_DETAIL_NOT_FOUND });
        }
        updatedPaymentDetail.orderId = orderId.trim();
        updatedPaymentDetail.totalAmount = totalAmount.trim();
        updatedPaymentDetail.paymentType = paymentType.trim();
        updatedPaymentDetail.onlinPaymentId = onlinPaymentId.trim();
        updatedPaymentDetail.bankPaymentId = bankPaymentId.trim();
        updatedPaymentDetail.status = status.trim();
        const savedPaymentDetail = await updatedPaymentDetail.save();

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_PAYMENT_DETAIL_UPDATE_SUCCEESFULL,
            data: savedPaymentDetail,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPaymentDetail = await PaymentDetail.findByIdAndDelete(id);
        if (!deletedPaymentDetail) {
            res.json({ status: false, message: constant.MSG_FOR_PAYMENT_DETAIL_NOT_FOUND });
        } else {
            res.status(200).json({ status: true, message: constant.MSG_FOR_PAYMENT_DETAIL_DELETE_SUCCEESFULL });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};


//update the status using id
exports.statusChnage = (req, res) => {
    const faqId = req.params.id;
    const { status } = req.body;

    PaymentDetail.findByIdAndUpdate(faqId, { status })
        .then(updatedPaymentDetail => {
            res.json({status: true, updatedPaymentDetail: updatedPaymentDetail});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: false, error: 'Failed to update status' });
        });
};