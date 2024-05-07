const FAQs = require('../../schema/Admin/FAQsSchema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getFaqs = await FAQs.find().sort({ order: 1 });
        console.log(getFaqs)

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_FAQS_DATA_SUCCESSFULLY,
            data: getFaqs,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const question = req.body.question;

        const existingFAQ = await FAQs.findOne({ question });

        if (existingFAQ) {
            return res.json({ status: false, message: 'A FAQ with the same question already exists' });
        }

        const FaqsData = {
            question: question.trim(),
            answer: req.body.answer.trim(),
        };
            
        const createdFAQs = await FAQs.create(FaqsData);
        
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_FAQS_ADD_SUCCEESFULL,
            data: createdFAQs,
        });
    } catch (error) {
        console.log({ status: false, message: error.message })
        res.json({ status: false, message: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const getFaqs = await FAQs.findById(req.params.id);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_FAQS_DATA_SUCCESSFULLY,
            data: getFaqs,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedFaqs = await FAQs.findById(id);

        if (!updatedFaqs) {
            return res.json({ status: false, message: constant.MSG_FOR_FAQS_NOT_FOUND });
        }

        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.json({ status: false, message: 'All fields are required' });
        }

        const existingFAQ = await FAQs.findOne({ question, _id: { $ne: id } });

        if (existingFAQ) {
            return res.json({ status: false, message: 'A FAQ with the same question already exists' });
        }

        updatedFaqs.question = question.trim();
        updatedFaqs.answer = answer.trim();
        const savedFaqs = await updatedFaqs.save();

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_FAQS_UPDATE_SUCCEESFULL,
            data: updatedFaqs,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};



exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFaqs = await FAQs.findByIdAndDelete(id);
        if (!deletedFaqs) {
            res.json({ status: false, message: constant.MSG_FOR_FAQS_NOT_FOUND });
        } else {
            res.status(200).json({ status: true, message: constant.MSG_FOR_FAQS_DELETE_SUCCEESFULL });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.statusChnage = (req, res) => {
    const faqId = req.params.id;
    const { status } = req.body;

    FAQs.findByIdAndUpdate(faqId, { status })
        .then(updatedUser => {
            res.json(updatedUser);
        })
        .catch(err => {
            console.error(err);
            res.json({ status: false, error: constant.MSG_FOR_FAILED_UPDATE_STATUS });
        });
};

exports.reorder = async (req, res) => {
    try {
        const { newOrder } = req.body;

        for (let i = 0; i < newOrder.length; i++) {
            const faqId = newOrder[i];
            const faq = await FAQs.findById(faqId);

            if (faq) {
                faq.order = i;
                await faq.save();
            }
        }

        res.status(200).json({ message: constant.MSG_FOR_TABLE_ORDER_UPDATE_SUCCESSFULL });
    } catch (error) {
        console.error(error);
        res.json({ status: false, error: constant.MSG_FOR_INTERNAL_SERVER_ERROR });
    }
};

exports.counts = async (req, res) => {
    try {
        const count = await FAQs.countDocuments({});
        res.json({ status: true, count: count });
    } catch (error) {
        console.error('Error counting faqs:', error);
        res.json({ status: false, error: 'Could not count faqs' });
    }
};