const CouponCode = require('../../schema/Admin/CouponCodeSchema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getCouponCode = await CouponCode.find().sort({ order: 1 });

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_COUPON_CODE_DATA_SUCCESSFULLY,
            data: getCouponCode,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { title, code, description, discount, maxDiscount, minimumOrderValue, startDate, endDate } = req.body;
        
        if (!title || !code || !description || !discount || !maxDiscount || !minimumOrderValue || !startDate || !endDate) {
            return res.json({ status: false, message: 'All fields are required' });
        }

        if (discount <= 0 || maxDiscount <= 0 || minimumOrderValue <= 0) {
            return res.json({ status: false, message: 'Enter Only positive values' });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.json({ status: false, message: 'Start date must be earlier than end date' });
        }

        const existingTitleCoupon = await CouponCode.findOne({ title });
        if (existingTitleCoupon) {
            return res.json({ status: false, message: 'A coupon code with the same title already exists' });
        }

        const existingCodeCoupon = await CouponCode.findOne({ code });
        if (existingCodeCoupon) {
            return res.json({ status: false, message: 'A coupon code with the same code already exists' });
        }

        const CouponCodeData = {
            title: title.trim(),
            code: code.trim(),
            description: description.trim(),
            discount: discount.trim(),
            maxDiscount: maxDiscount.trim(),
            minimumOrderValue: minimumOrderValue.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim(),
        };
        const createdCouponCode = await CouponCode.create(CouponCodeData);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_COUPON_CODE_ADD_SUCCEESFULL,
            data: createdCouponCode,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};


exports.show = async (req, res) => {
    try {
        const id = req.params.id;
        const getCouponCode = await CouponCode.findById(id);
        if (getCouponCode) {
            res.status(200).json({
                status: true,
                message: constant.MSG_FOR_GET_COUPON_CODE_DATA_SUCCESSFULLY,
                data: getCouponCode,
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Coupon code not found',
            });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.validateCode = async (req, res) => {
    try {
        const couponCode = req.params.id;
        const getCouponCode = await CouponCode.findOne({ code: couponCode });
        if (getCouponCode) {
            res.status(200).json({
                status: true,
                message: constant.MSG_FOR_GET_COUPON_CODE_DATA_SUCCESSFULLY,
                data: getCouponCode,
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Coupon code not found',
            });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const { title, code, description, discount, maxDiscount, minimumOrderValue, startDate, endDate } = req.body;

        if (!title || !code || !description || !discount || !maxDiscount || !minimumOrderValue || !startDate || !endDate) {
            return res.json({ status: false, message: 'All fields are required' });
        }

        if (discount <= 0 || maxDiscount <= 0 || minimumOrderValue <= 0) {
            return res.json({ status: false, message: 'Enter Only positive values' });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.json({ status: false, message: 'Start date must be earlier than end date' });
        }

        const updatedCouponCode = await CouponCode.findById(id);

        if (!updatedCouponCode) {
            return res.json({ status: false, message: constant.MSG_FOR_COUPON_CODE_NOT_FOUND });
        }

        const existingTitleCoupon = await CouponCode.findOne({ title, _id: { $ne: id } });
        if (existingTitleCoupon) {
            return res.json({ status: false, message: 'A coupon code with the same title already exists' });
        }

        const existingCodeCoupon = await CouponCode.findOne({ code, _id: { $ne: id } });
        if (existingCodeCoupon) {
            return res.json({ status: false, message: 'A coupon code with the same code already exists' });
        }

        updatedCouponCode.title = title.trim();
        updatedCouponCode.code = code.trim();
        updatedCouponCode.description = description.trim();
        updatedCouponCode.discount = discount.trim();
        updatedCouponCode.maxDiscount = maxDiscount;
        updatedCouponCode.minimumOrderValue = minimumOrderValue;
        updatedCouponCode.startDate = startDate.trim();
        updatedCouponCode.endDate = endDate.trim();
        const savedCouponCode = await updatedCouponCode.save();

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_COUPON_CODE_UPDATE_SUCCEESFULL,
            data: updatedCouponCode,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};



exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCouponCode = await CouponCode.findByIdAndDelete(id);
        if (!deletedCouponCode) {
            res.json({ status: false, message: constant.MSG_FOR_COUPON_CODE_NOT_FOUND });
        } else {
            res.status(200).json({ status: true, message: constant.MSG_FOR_COUPON_CODE_DELETE_SUCCEESFULL });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};


//update the status using id
exports.statusChnage = (req, res) => {
    const faqId = req.params.id;
    const { status } = req.body;

    CouponCode.findByIdAndUpdate(faqId, { status })
        .then(updatedUser => {
            res.json(updatedUser);
        })
        .catch(err => {
            res.status(500).json({ error: constant.MSG_FOR_FAILED_UPDATE_STATUS });
        });
};

exports.reorder = async (req, res) => {
    try {
        const { newOrder } = req.body;
        for (let i = 0; i < newOrder.length; i++) {
            const couponcodeId = newOrder[i];
            const couponcode = await CouponCode.findById(couponcodeId);

            if (couponcode) {
                couponcode.order = i;
                await couponcode.save();
            }
        }
        res.status(200).json({ message: constant.MSG_FOR_TABLE_ORDER_UPDATE_SUCCESSFULL });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: constant.MSG_FOR_INTERNAL_SERVER_ERROR });
    }
};

exports.counts = async (req, res) => {
    try {
        const count = await CouponCode.countDocuments({});
        res.json({ count });
    } catch (error) {
        console.error('Error counting :', error);
        res.status(500).json({ error: 'Could not count ' });
    }
};