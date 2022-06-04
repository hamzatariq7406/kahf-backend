const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: Number, required: true },
        itemTotal: { type: Number, required: true },
      },
    ],
    address:{ type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalPrice: Number,
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
