const ContactUs = require('../../schema/Admin/ContactUsSchema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getContactUs = await ContactUs.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_CONTACTUS_DATA_SUCCESSFULLY,
            data: getContactUs,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;

        const lastPendingEntry = await ContactUs.findOne({ email, status: 'Pending' });

        if (lastPendingEntry) {
            return res.status(400).json({ status: false, message: 'There is already a pending request with this email' });
        }

        const ContactUsData = {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            subject: subject.trim(),
        };

        const createdContactUs = await ContactUs.create(ContactUsData);

        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_CONTACTUS_ADD_SUCCEESFULL,
            data: createdContactUs,
        });
    } catch (error) {
        console.log({ status: false, message: error.message });
        res.json({ status: false, message: error.message });
    }
};



exports.show = async (req, res) => {
    try {
        const getContactUs = await ContactUs.findById(req.params.id);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_CONTACTUS_DATA_SUCCESSFULLY,
            data: getContactUs,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

//update the status using id
exports.statusChnage = (req, res) => {
    const faqId = req.params.id;
    const { status } = req.body;

    ContactUs.findByIdAndUpdate(faqId, { status })
        .then(updatedUser => {
            res.json(updatedUser);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error:constant.MSG_FOR_FAILED_UPDATE_STATUS});
        });
};

exports.counts = async (req, res) => {
    try {
        const count = await ContactUs.countDocuments({});
        res.json({ count });
    } catch (error) {
        console.error('Error counting contact-us:', error);
        res.status(500).json({ error: 'Could not count contact-us' });
    }
};