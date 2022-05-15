const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const AddressSchema = new mongoose.Schema({
    title: { type: String, required: true },
    default: { type: Boolean, required: true },
    address: {
        formatted_address: { type: String, required: true }
    },
    userId: { type: Schema.Types.ObjectId, ref: 'user' }
});
const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;
