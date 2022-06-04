const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Address = require("../models/addressModel");
const Product = require('../models/productModel');
const { isAdmin, isAuth } = require('../utils');

const orderRouter = express.Router();
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({
      users,
      orders: orders.length === 0 ? [{ numOrders: 0, totalSales: 0 }] : orders,
      dailyOrders,
      productCategories,
    });
  })
);
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user').populate("address");
    res.send(orders);
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('user').populate("address");
    const newArray = orders.map(item => {
      let deliveryStatus = "Running";
      if (item.isDelivered) {
        deliveryStatus = "Delivered";
      }
      const trackNum = item._id.toString().substring(0, 7);
      const someDate = new Date(item.deliveredAt);
      const date = new Date(someDate.setDate(someDate.getDate())).toLocaleDateString('en-us', { weekday: "short", year: "numeric", month: "short", day: "numeric" })
      return {
        id: item._id,
        tracking_number: trackNum,
        amount: item.totalPrice,
        total: item.totalPrice,
        delivery_fee: 0,
        created_at: item.paidAt,
        discount: 0,
        status: {
          name: deliveryStatus
        },
        shipping_address: {
          street_address: item.address.address.formatted_address
        },
        delivery_time: date,
        products: item.orderItems
      }
    })

    res.send(newArray);
  })
);
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user').populate("address");
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const order = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      totalPrice: req.body.totalPrice,
      isPaid: req.body.isPaid,
      address: req.body.address,
      isDelivered: req.body.isDelivered,
      paidAt: req.body.paidAt,
      deliveredAt: req.body.deliveredAt
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  })
);
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deletedOrder = await order.remove();
      res.send({ message: 'Order Deleted', product: deletedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment.paymentResult = {
        payerID: req.body.payerID,
        paymentID: req.body.paymentID,
        orderID: req.body.orderID,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found.' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found.' });
    }
  })
);

module.exports = orderRouter;
