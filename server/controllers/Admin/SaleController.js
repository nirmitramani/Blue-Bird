const Sale = require('../../schema/Admin/SaleSchema');
const constant = require('../../config/Constant');
const { deleteImage } = require('../../helper/function');

exports.index = async (req, res) => {
    try {
        const getSale = await Sale.find().sort({ order: 1 });
        console.log(getSale)

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_EVENTS_DATA_SUCCESSFULLY,
            data: getSale,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.json({ status: false, message: 'All fields are required' });
        }

        const existingSale = await Sale.findOne({ name });

        if (existingSale) {
            return res.json({ status: false, message: 'An sale with the same name already exists' });
        }

        if(!req.file.filename){
            return res.json({ status: false, message: 'File is required' });
        }

        const saleData = {
            saleimg: req.file.filename,
            name: name,
            description: description,
        };

        const createdSale = await Sale.create(saleData);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_EVENT_ADD_SUCCEESFULL,
            data: createdSale,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};



exports.show = async (req, res) => {
    try {
        const getSale = await Sale.findById(req.params.id);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_EVENTS_DATA_SUCCESSFULLY,
            data: getSale,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSale = await Sale.findById(id);

        if (!updatedSale) {
            return res.json({ status: false, message: constant.MSG_FOR_EVENT_NOT_FOUND });
        }

        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ status: false, message: 'All fields are required' });
        }

        const existingSale = await Sale.findOne({ name, _id: { $ne: id } });

        if (existingSale) {
            return res.status(400).json({ status: false, message: 'An sale with the same name already exists' });
        }

        if (req.file) {
            const imagePath = `public/images/sale/${updatedSale.saleimg}`;
            deleteImage(imagePath);
        }

        updatedSale.saleimg = req.file ? req.file.filename : updatedSale.saleimg;
        updatedSale.name = name;
        updatedSale.description = description;
        const savedSale = await updatedSale.save();

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_EVENT_UPDATE_SUCCEESFULL,
            data: savedSale,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};



exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSale = await Sale.findByIdAndDelete(id);
        if (!deletedSale) {
            res.json({ status: false, message: constant.MSG_FOR_EVENT_NOT_FOUND });
        } else {
            const imagePath = `public/images/sale/${deletedSale.saleimg}`;
            deleteImage(imagePath);
            res.status(200).json({ status: true, message: constant.MSG_FOR_EVENT_DELETE_SUCCEESFULL });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};


//update the status using id
exports.statusChnage = (req, res) => {
    const saleId = req.params.id;
    const { status } = req.body;

    Sale.findByIdAndUpdate(saleId, { status })
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
            const saleId = newOrder[i];
            const sale = await Sale.findById(saleId);

            if (sale) {
                sale.order = i;
                await sale.save();
            }
        }

        res.status(200).json({ status: true, message: constant.MSG_FOR_TABLE_ORDER_UPDATE_SUCCESSFULL });
    } catch (error) {
        console.error(error);
        res.json({ status: false, error: constant.MSG_FOR_INTERNAL_SERVER_ERROR });
    }
};

exports.counts = async (req, res) => {
    try {
        const count = await Sale.countDocuments({});
        res.json({ count });
    } catch (error) {
        console.error('Error counting sale:', error);
        res.status(500).json({ error: 'Could not count sale' });
    }
};