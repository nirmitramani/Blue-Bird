const Slider = require("../../schema/Admin/SliderSchema");
const constant = require("../../config/Constant");
const { deleteImage } = require("../../helper/function");

exports.index = async (req, res) => {
  try {
    const getSlider = await Slider.find().sort({ order: 1 });
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_SLIDER_DATA_SUCCESSFULLY,
      data: getSlider,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.file || !req.file.filename || !req.body.title) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
    }

    const isTitleUnique = await Slider.findOne({ title: req.body.title });
    if (isTitleUnique) {
      return res.status(400).json({
        status: false,
        message:
          "Title must be unique. A slider with the same title already exists.",
      });
    }

    const totalCount = await Slider.countDocuments();

    const sliderData = {
      sliderimg: req.file.filename.trim(),
      title: req.body.title.trim(),
      order: totalCount + 1,
    };

    const createdSlider = await Slider.create(sliderData);

    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_SLIDER_ADD_SUCCEESFULL,
      data: createdSlider,
    });
  } catch (error) {
    console.log({ status: false, message: error.message });
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const getSlider = await Slider.findById(req.params.id);
    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_GET_SLIDER_DATA_SUCCESSFULLY,
      data: getSlider,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.file || !req.file.filename || !req.body.title) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
    }

    const updatedSlider = await Slider.findById(id);

    if (!updatedSlider) {
      return res.json({
        status: false,
        message: constant.MSG_FOR_SLIDER_NOT_FOUND,
      });
    }

    if (req.body.title !== updatedSlider.title) {
      const isTitleUnique = await Slider.findOne({
        title: req.body.title,
        _id: { $ne: id },
      });
      if (isTitleUnique) {
        return res.status(400).json({
          status: false,
          message:
            "Title must be unique. A slider with the same title already exists.",
        });
      }
    }

    if (req.file) {
      const imagePath = `public/images/slider/${updatedSlider.sliderimg}`;
      deleteImage(imagePath);
    }

    updatedSlider.sliderimg = req.file
      ? req.file.filename.trim()
      : updatedSlider.sliderimg;
    updatedSlider.title = req.body.title.trim();
    const savedSlider = await updatedSlider.save();

    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_SLIDER_UPDATE_SUCCESSFUL,
      data: updatedSlider,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSlider = await Slider.findByIdAndDelete(id);
    if (!deletedSlider) {
      res.json({ status: false, message: constant.MSG_FOR_SLIDER_NOT_FOUND });
    } else {
      const imagePath = `public/images/slider/${deletedSlider.sliderimg}`;
      deleteImage(imagePath);
      res
        .status(200)
        .json({
          status: true,
          message: constant.MSG_FOR_SLIDER_DELETE_SUCCEESFULL,
        });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.statusChnage = (req, res) => {
  const sliderId = req.params.id;
  const { status } = req.body;

  Slider.findByIdAndUpdate(sliderId, { status })
    .then((updatedUser) => {
      res.json({ status: false, updatedUser: updatedUser });
    })
    .catch((err) => {
      res.json({ status: false, error: constant.MSG_FOR_FAILED_UPDATE_STATUS });
    });
};

exports.reorder = async (req, res) => {
  try {
    const { newOrder } = req.body;
    for (let i = 0; i < newOrder.length; i++) {
      const sliderId = newOrder[i];
      const slider = await Slider.findById(sliderId);

      if (slider) {
        slider.order = i;
        await slider.save();
      }
    }
    res
      .status(200)
      .json({
        status: true,
        message: constant.MSG_FOR_TABLE_ORDER_UPDATE_SUCCESSFULL,
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, error: constant.MSG_FOR_INTERNAL_SERVER_ERROR });
  }
};

exports.counts = async (req, res) => {
  try {
    const count = await Slider.countDocuments({});
    res.json({ status: true, count: count });
  } catch (error) {
    res.status(500).json({ status: false, error: "Could not count Slider" });
  }
};
