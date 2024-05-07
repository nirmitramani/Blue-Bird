const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    couponId: {
      type: String,
    },
    discountAmount: {
      type: Number,
    },
    orderDate: {
      type: Date,
    },
    paymentType: {
      type: String,
      enum: ["Online", "COD"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["Pending", "Deliverd", "Cancel"],
      required: true,
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
  {
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
    paymentDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentDetail",
    },
  }
);

module.exports = mongoose.model("orders", OrderSchema);
