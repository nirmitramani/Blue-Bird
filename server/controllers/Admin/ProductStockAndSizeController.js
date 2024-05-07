const ProductStockAndSize = require('../../schema/Admin/ProductStockAndSizeschema');
const constant = require('../../config/Constant');

exports.index = async (req, res) => {
    try {
        const getProductStockAndSize = await ProductStockAndSize.find().sort({ order: 1 });

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_PRODUCT_STOCK_SND_SIZE_DATA_SUCCESSFULLY,
            data: getProductStockAndSize,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        
        if (!req.body.size || !req.body.stockQuantity || !req.body.productId) {
            return res.status(400).json({
                status: false,
                message: "All fields are required.",
            });
        }

        
        const stockQuantity = parseInt(req.body.stockQuantity);
        if (isNaN(stockQuantity) || stockQuantity <= 0) {
            return res.status(400).json({
                status: false,
                message: "stockQuantity must be a positive number.",
            });
        }

        
        const existingRecord = await ProductStockAndSize.findOne({
            where: {
                productId: req.body.productId,
                size: req.body.size
            }
        });

        if (existingRecord) {
            return res.status(400).json({
                status: false,
                message: "A record with the same productId and size already exists.",
            });
        }

        const ProductStockAndSizeData = {
            size: req.body.size,
            stockQuantity: stockQuantity, 
            productId: req.body.productId,
        };
        
        const createdProductStockAndSize = await ProductStockAndSize.create(ProductStockAndSizeData);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_PRODUCT_STOCK_SND_SIZE_ADD_SUCCEESFULL,
            data: createdProductStockAndSize,
        });
    } catch (error) {
        console.log({ status: false, message: error.message });
        res.status(500).json({ status: false, message: error.message });
    }
};


exports.show = async (req, res) => {
    try {
        const getProductStockAndSize = await ProductStockAndSize.findById(req.params.id);
        res.status(201).json({
            status: true,
            message: constant.MSG_FOR_GET_PRODUCT_STOCK_SND_SIZE_DATA_SUCCESSFULLY,
            data: getProductStockAndSize,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        
        if (!req.body.size || !req.body.stockQuantity || !req.body.productId) {
            return res.status(400).json({
                status: false,
                message: "All fields are required.",
            });
        }

        
        const stockQuantity = parseInt(req.body.stockQuantity);
        if (isNaN(stockQuantity) || stockQuantity <= 0) {
            return res.status(400).json({
                status: false,
                message: "stockQuantity must be a positive number.",
            });
        }

        
        const existingRecord = await ProductStockAndSize.findOne({
            where: {
                productId: req.body.productId.trim(),
                size: req.body.size.trim()
            }
        });

        if (existingRecord) {
            return res.status(400).json({
                status: false,
                message: "A record with the same productId and size already exists.",
            });
        }

        const updatedProductStockAndSize = await ProductStockAndSize.findById(id);

        if (!updatedProductStockAndSize) {
            return res.json({ status: false, message: constant.MSG_FOR_PRODUCT_STOCK_SND_SIZE_NOT_FOUND });
        }

        updatedProductStockAndSize.size = req.body.size.trim();
        updatedProductStockAndSize.stockQuantity = req.body.stockQuantity;
        updatedProductStockAndSize.productId = req.body.productId.trim();
        const savedProductStockAndSize = await updatedProductStockAndSize.save();

        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_PRODUCT_STOCK_SND_SIZE_UPDATE_SUCCEESFULL,
            data: savedProductStockAndSize,
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProductStockAndSize = await ProductStockAndSize.findByIdAndDelete(id);
        if (!deletedProductStockAndSize) {
            res.json({ status: false, message: constant.MSG_FOR_PRODUCT_STOCK_SND_SIZE_NOT_FOUND });
        } else {
            res.status(200).json({ status: true, message: constant.MSG_FOR_PRODUCT_STOCK_SND_SIZE_DELETE_SUCCEESFULL });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};



exports.statusChnage = (req, res) => {
    const productStockAndSizeId = req.params.id;
    const { status } = req.body;

    ProductStockAndSize.findByIdAndUpdate(productStockAndSizeId, { status })
        .then(updatedUser => {
            res.json({ status: true, updatedUser: updatedUser});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: false, error: constant.MSG_FOR_FAILED_UPDATE_STATUS });
        });
};

exports.counts = async (req, res) => {
    try {
        const count = await ProductStockAndSize.countDocuments({});
        res.json({ status: true, count: count });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Could not count ProductStockAndSize' });
    }
};

exports.sizeByProduct = async (req, res) => {
    try {
        const getProductStockAndSize = await ProductStockAndSize.find({ productId: req.params.id });
        if (!getProductStockAndSize || getProductStockAndSize.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Product sizes and stock not found for the specified product id",
            });
        }
        res.status(200).json({
            status: true,
            message: constant.MSG_FOR_GET_PRODUCT_STOCK_SND_SIZE_DATA_SUCCESSFULLY,
            data: getProductStockAndSize,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
