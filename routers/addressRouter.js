const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Address = require('../models/addressModel');
const { isAuth } = require('../utils');


const addressRouter = express.Router();

addressRouter.get(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const addresses = await Address.where('userId').equals(req.user._id);
      res.send(addresses);
    })
  );

addressRouter.post(
    '/add-address',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const address = new Address({
            title: req.body.title,
            default: req.body.default,
            address: req.body.address,
            userId: req.user._id
        });
        const createAddress = await address.save();
        if (createAddress) {
            res
                .status(201)
                .send({ message: 'Product Created', address: createAddress });
        } else {
            res.status(500).send({ message: 'Error in creating address' });
        }
    })
);

module.exports = addressRouter;
