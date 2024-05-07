const Product = require('../../schema/Admin/ProductSchema');
const constant = require('../../config/Constant');
const { deleteImage } = require('../../helper/function');

exports.index = async (req, res) => {
  try {
    const getProduct = await Product.find().sort({ order: -1 }); 
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_PRODUCT_DATA_SUCCESSFULLY,
      data: getProduct,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.store = async (req, res) => {
  try {
  
    const { name, shortdescription, description, categoryid, price } = req.body;
    if (!name || !shortdescription || !description || !categoryid || !price) {
      return res.json({ status: false, message: 'All fields are required' });
    }

  
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.json({ status: false, message: 'Price must be a positive number' });
    }

    const isNameUnique = await Product.findOne({ name, categoryid });
    if (isNameUnique) {
      return res.json({ status: false, message: 'Product with the same name and category already exists' });
    }

    console.log(req.files);

    const productImages = req.files.filter(file => file.fieldname.startsWith('productthumbimg'));
    if (productImages.length === 0) {
      return res.json({ status: false, message: 'Thumb image is required' });
    }
  
    if(!req.files.find(file => file.fieldname === 'productimg')){
      return res.json({ status: false, message: 'Product image is required' });
    }
    
    const productthumbimg = productImages.map(file => file.filename);
    const productimgFilename = req.files.find(file => file.fieldname === 'productimg').filename;

    const productData = {
      productimg: productimgFilename,
      productthumbimg: productthumbimg,
      name: name,
      shortdescription: shortdescription,
      description: description,
      categoryid: categoryid,
      price: price,
    };

    const createdProduct = await Product.create(productData);
    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_PRODUCT_ADD_SUCCEESFULL,
      data: createdProduct,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_GET_PRODUCT_DATA_SUCCESSFULLY,
      data: getProduct,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ status: false, message: 'Product not found' });
    }

  
    const { name, shortdescription, description, categoryid, price } = req.body;
    if (!name || !shortdescription || !description || !categoryid || !price) {
      return res.json({ status: false, message: 'All fields are required' });
    }

  
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.json({ status: false, message: 'Price must be a positive number' });
    }
  
    const isNameUnique = await Product.findOne({ name, categoryid, _id: { $ne: id } });
    if (isNameUnique) {
      return res.json({ status: false, message: 'Product with the same name and category already exists' });
    }

    if (req.files) {
      const thumbimage = [];
      for (const file of req.files) {
        if (file.fieldname === 'productimg') {
          const oldProductImagePath = `public/images/products/${existingProduct.productimg}`;
          deleteImage(oldProductImagePath);
          existingProduct.productimg = file.filename;
        } else if (file.fieldname.startsWith('productthumbimg_')) {
          for (const oldThumbImg of existingProduct.productthumbimg) {
            const oldThumbImgPath = `public/images/products/${oldThumbImg}`;
            deleteImage(oldThumbImgPath);
          }
          thumbimage.push(file.filename.trim());
        }
      }
      if (req.files.find(file => file.fieldname.startsWith('productthumbimg_'))) {
        existingProduct.productthumbimg = thumbimage;
      }
    }

    existingProduct.name = name.trim();
    existingProduct.shortdescription = shortdescription.trim();
    existingProduct.description = description.trim();
    existingProduct.price = price.trim();
    existingProduct.categoryid = categoryid.trim();

    const updatedProduct = await existingProduct.save();

    return res.status(200).json({
      status: true,
      message: constant.MSG_FOR_PRODUCT_UPDATE_SUCCEESFULL,
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.json({ status: false, message: constant.MSG_FOR_PRODUCT_NOT_FOUND });
    } else {
      res.status(200).json({ status: true, message: constant.MSG_FOR_PRODUCT_DELETE_SUCCEESFULL });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.statusChnage = (req, res) => {
  const productId = req.params.id;
  const { status } = req.body;

  Product.findByIdAndUpdate(productId, { status })
    .then(updatedUser => {
      res.json(updatedUser);
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
      const productId = newOrder[i];
      const product = await Product.findById(productId);

      if (product) {
        product.order = i;
        await product.save();
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
    const count = await Product.countDocuments({});
    res.json({ status: true, count: count });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ status: false, error: 'Could not count products' });
  }
};
