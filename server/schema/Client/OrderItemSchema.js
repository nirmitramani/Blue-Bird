const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
    },
    size: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("order_items", OrderItemSchema);
