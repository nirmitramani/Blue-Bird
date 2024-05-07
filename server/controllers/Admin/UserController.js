const User = require("../../schema/Client/UserSchema");
const constant = require("../../config/Constant");
const { deleteImage } = require("../../helper/function");
const bcrypt = require("bcrypt");

exports.index = async (req, res) => {
  try {
    const getUser = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_USER_DATA_SUCCESSFULLY,
      data: getUser,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_GET_USER_DATA_SUCCESSFULLY,
      data: getUser,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.byToken = async (req, res) => {
  try {
    const userToken = req.params.token;
    const getUser = await User.findOne({ token: userToken });
    res.status(201).json({
      status: true,
      message: constant.MSG_FOR_GET_USER_DATA_SUCCESSFULLY,
      data: getUser,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const { email, userName, phone, gender } = req.body;

    if (!email || !userName) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (email !== existingUser.email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res
          .status(400)
          .json({
            status: false,
            message: "User with the same email already exists",
          });
      }
    }

    if (userName !== existingUser.userName) {
      const existingUserNameUser = await User.findOne({ userName });
      if (existingUserNameUser) {
        return res
          .status(400)
          .json({
            status: false,
            message: "User with the same userName already exists",
          });
      }
    }

    if (req.file && req.file.fieldname === "profileimg") {
      const oldProfileImagePath = `public/images/user/${existingUser.profileimg}`;
      deleteImage(oldProfileImagePath);
      existingUser.profileimg = req.file.filename.trim();
    }

    existingUser.userName = userName.trim();
    existingUser.email = email.trim();
    existingUser.phone = phone;
    existingUser.gender = gender;

    const updatedUser = await existingUser.save();

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.json({ status: false, message: constant.MSG_FOR_USER_NOT_FOUND });
    } else {
      res
        .status(200)
        .json({
          status: true,
          message: constant.MSG_FOR_USER_DELETE_SUCCEESFULL,
        });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.statusChnage = (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  User.findByIdAndUpdate(userId, { status })
    .then((updatedUser) => {
      res.json({ status: true, data: updatedUser });
    })
    .catch((err) => {
      res.json({ error: constant.MSG_FOR_FAILED_UPDATE_STATUS });
    });
};

exports.counts = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    res.json({ status: true, count: count });
  } catch (error) {
    console.error("Error counting event:", error);
    res.json({ status: false, error: "Could not count event" });
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.json({ status: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.json({ status: false, message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    existingUser.password = hashedPassword;

    const updatedUser = await existingUser.save();

    return res.status(200).json({
      status: true,
      message: constant.MSG_FOR_USER_UPDATE_SUCCESSFUL,
      data: updatedUser,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};
