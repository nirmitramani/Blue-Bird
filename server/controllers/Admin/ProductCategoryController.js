const ProductCategory = require('../../schema/Admin/ProductCategoriesSchema');
const constant = require('../../config/Constant');
const { deleteImage } = require('../../helper/function');

exports.index = async (req, res) => {
  try {
    const getProductCategory = await ProductCategory.find().sort({ order: 1 });
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_PRODUCT_CATEGORY_DATA_SUCCESSFULLY,
      data: getProductCategory,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.store = async (req, res) => {
  try {
      const { name, gender } = req.body;

      const existingProductCategory = await ProductCategory.findOne({ name, gender });

      if (existingProductCategory) {
          return res.status(400).json({ status: false, message: 'A product category with the same name and gender already exists' });
      }

      const ProductCategoryData = {
          productcategoryimg: req.file.filename,
          name,
          gender,
      };

      const createdProductCategory = await ProductCategory.create(ProductCategoryData);

      res.status(201).json({
          status: true,
          message: constant.MSG_FOR_PRODUCT_CATEGORY_ADD_SUCCEESFULL,
          data: createdProductCategory,
      });
  } catch (error) {
      console.log({ status: false, message: error.message });
      res.json({ status: false, message: error.message });
  }
};


exports.show = async (req, res) => {
  try {
    const getProductCategory = await ProductCategory.findById(req.params.id);
    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_GET_PRODUCT_CATEGORY_DATA_SUCCESSFULLY,
      data: getProductCategory,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
      const { name, gender } = req.body;

      if (!name || !gender) {
          return res.status(400).json({ status: false, message: 'All fields are required' });
      }

      const existingProductCategory = await ProductCategory.findOne({ name, gender, _id: { $ne: id } });

      if (existingProductCategory) {
          return res.status(400).json({ status: false, message: 'A product category with the same name and gender already exists' });
      }

      const updatedProductCategory = await ProductCategory.findById(id);

      if (!updatedProductCategory) {
          return res.json({ status: false, message: constant.MSG_FOR_PRODUCT_CATEGORY_NOT_FOUND });
      }

      if (req.file) {
          const imagePath = `public/images/product-categories/${updatedProductCategory.productcategoryimg}`;
          deleteImage(imagePath);
      }

      updatedProductCategory.productcategoryimg = req.file ? req.file.filename : updatedProductCategory.productcategoryimg;
      updatedProductCategory.name = name;
      updatedProductCategory.gender = gender;
      const savedProductCategory = await updatedProductCategory.save();

      res.status(200).json({
          status: true,
          message: constant.MSG_FOR_PRODUCT_CATEGORY_UPDATE_SUCCEESFULL,
          data: updatedProductCategory,
      });
  } catch (error) {
      res.json({ status: false, message: error.message });
  }
};


exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProductCategory = await ProductCategory.findByIdAndDelete(id);
    if (!deletedProductCategory) {
      res.json({ status: false, message: constant.MSG_FOR_PRODUCT_CATEGORY_NOT_FOUND });
    } else {
      const imagePath = `public/images/product-categories/${deletedProductCategory.productcategoryimg}`;
      deleteImage(imagePath);
      res.status(200).json({ status: true, message: constant.MSG_FOR_PRODUCT_CATEGORY_DELETE_SUCCEESFULL });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};


//update the status using id
exports.statusChnage = (req, res) => {
  const ProductCategoryId = req.params.id;
  const { status } = req.body;

  ProductCategory.findByIdAndUpdate(ProductCategoryId, { status })
    .then(updatedUser => {
      res.json({status: true, data: updatedUser});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ status: false, error: constant.MSG_FOR_FAILED_UPDATE_STATUS });
    });
};

exports.reorder = async (req, res) => {
  try {
    const { newOrder } = req.body;

    for (let i = 0; i < newOrder.length; i++) {
      const productCategoryId = newOrder[i];
      const productCategory = await ProductCategory.findById(productCategoryId);

      if (productCategory) {
        productCategory.order = i;
        await productCategory.save();
      }
    }

    res.status(200).json({ status: true, message: constant.MSG_FOR_TABLE_ORDER_UPDATE_SUCCESSFULL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: constant.MSG_FOR_INTERNAL_SERVER_ERROR });
  }
};

exports.counts = async (req, res) => {
  try {
    const count = await ProductCategory.countDocuments({});
    res.json({ status: true, count: count });
  } catch (error) {
    console.error('Error counting productCategory:', error);
    res.status(500).json({ status: false, error: 'Could not count productCategory' });
  }
};