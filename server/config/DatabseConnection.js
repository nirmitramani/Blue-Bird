const mongoose = require("mongoose");
const constant = require("./Constant");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(constant.MSG_FOR_CONNECTION_SUCCESSFUL);
  })
  .catch((error) => {
    console.error(constant.MSG_FOR_CONNECTION_ERROR, error);
  });
