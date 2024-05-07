const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schema/Client/UserSchema");
const secretKey = process.env.SECRET_TOKEN_KEY;
const constant = require("../config/Constant");

const createToken = (id, maxAge) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN_KEY, {
    expiresIn: maxAge,
  });
};
const signUp = async (req, res) => {
  try {
    const { email, userName, phone, password } = req.body;

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res
        .status(400)
        .json({
          status: false,
          message: "User with the same email already exists",
        });
    }

    // Check if the user with the same userName already exists
    const existingUserNameUser = await User.findOne({ userName });
    if (existingUserNameUser) {
      return res
        .status(400)
        .json({
          status: false,
          message: "User with the same userName already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      userName,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    const maxAge = 50 * 365 * 24 * 60 * 60;

    const token = createToken(newUser._id, maxAge);

    // Save the token in the database
    newUser.token = token;
    await newUser.save();

    res.cookie("user", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ status: true, user: newUser._id, created: true });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({
        status: false,
        message: "Registration failed",
        error: error.message,
      });
  }
};

// const signIn = async (req, res) => {
//     const { role } = req.params;
//     const { userName, email, password } = req.body;
//     const user = await User.findOne({ $or: [{ userName }, { email }] });

//     if (!user) {
//         return res.json({ status: false, message: constant.MSG_FOR_USER_NOT_FOUND });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//         return res.json({ status: false, message: constant.MSG_FOR_WRONG_PASSWORD });
//     }

//     if (role == user.role) {
//         const maxAge = 50 * 365 * 24 * 60 * 60;
//         const token = createToken(user._id, maxAge);

//         res.cookie(user.role, token, {
//             withCredentials: true,
//             httpOnly: false,
//             maxAge: maxAge * 1000,
//         });
//         res.status(200).json({ status: true, user: user, created: true });
//     } else {
//         return res.json({ status: false, message: constant.MSG_FOR_INVALID_CREDENTIALS });
//     }
// };
const signIn = async (req, res) => {
  const { role } = req.params;
  const { userNameOrEmail, password } = req.body;
  
  let user = await User.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
  });

  if (!user) {
    return res.json({
      status: false,
      message: constant.MSG_FOR_USER_NOT_FOUND,
    });
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.json({
      status: false,
      message: constant.MSG_FOR_WRONG_PASSWORD,
    });
  }

  if (role == user.role) {
    const maxAge = 50 * 365 * 24 * 60 * 60;
    const token = createToken(user._id, maxAge);

    // Save the token in the database
    user.token = token;
    await user.save();

    res.cookie(user.role, token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    return res.status(200).json({ status: true, user, created: true });
  } else {
    return res.json({
      status: false,
      message: constant.MSG_FOR_INVALID_CREDENTIALS,
    });
  }
};

module.exports = {
  signUp,
  signIn,
};
