const mongoose = require('mongoose');
const Schema = require('mongoose');

const ContactSchema = new mongoose.Schema({
    title: { type: String, required: true },
    default: { type: Boolean, required: true },
    number: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user' }
});
const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
