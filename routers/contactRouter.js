const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');
const { isAuth } = require('../utils');


const contactRouter = express.Router();

contactRouter.get(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const contacts = await Contact.where('userId').equals(req.user._id);
        res.send(contacts);
    })
);

contactRouter.post(
    '/add-contact',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const contact = new Contact({
            title: req.body.title,
            default: req.body.default,
            number: req.body.number,
            userId: req.user._id
        });
        const createContact = await contact.save();
        if (createContact) {
            res
                .status(201)
                .send({ message: 'Contact Created', contact: createContact });
        } else {
            res.status(500).send({ message: 'Error in creating contact' });
        }
    })
);

module.exports = contactRouter;
