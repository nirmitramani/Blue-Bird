const Review = require('../../schema/Client/ReviewSchema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getReview = await Review.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_REVIEW_DATA_SUCCESSFULLY,
            data: getReview,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { productId, rating, description, name } = req.body;

        if (!productId || !rating || !description || !name) {
            return res.status(400).json({
                status: false,
                message: "All fields are required.",
            });
        }

        if (isNaN(rating) || rating <= 0) {
            return res.status(400).json({
                status: false,
                message: "Rating must be a positive number.",
            });
        }

        const ReviewData = {
            productId: productId.trim(),
            name: name.trim(),
            rating: rating.trim(),
            description: description.trim(),
        };

        const createdReview = await Review.create(ReviewData);

        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_REVIEW_ADD_SUCCEESFULL,
            data: createdReview,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


exports.show = async (req, res) => {
    try {
        const getReview = await Review.findById(req.params.id);

        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_REVIEW_DATA_SUCCESSFULLY,
            data: getReview,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            res.json({ status: false, message: constant.MSG_FOR_REVIEW_NOT_FOUND });
        } else {
            res.status(200).json({ status: true, message: constant.MSG_FOR_REVIEW_DELETE_SUCCEESFULL });
        }

    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

//update the status using id
exports.statusChnage = (req, res) => {
    const faqId = req.params.id;
    const { status } = req.body;

    Review.findByIdAndUpdate(faqId, { status })
        .then(updatedReview => {
            res.json({ status: true, updatedReview: updatedReview });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: false, error: 'Failed to update status' });
        });
};

exports.counts = async (req, res) => {
    try {
        const count = await Review.countDocuments({});
        res.json({ status: true, data: count });
    } catch (error) {
        console.error('Error counting event:', error);
        res.status(500).json({ status: false, error: 'Could not count event' });
    }
};