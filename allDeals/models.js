'use strict';

const mongoose = require('mongoose');

const dealSchema = mongoose.Schema({
    dealName: {type: String, required: true},
    productCategory: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    seller: {type: String, required: true},
    productDescription: {type: String, required: true},
    dealLink: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [{
        comment: {type: String},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: mongoose.Schema.Types.String, ref: 'User'},
        commentCreatedAt: {type: Date, default: Date.now},
        deal_id: {type: mongoose.Schema.Types.ObjectId}
    }],
    createdAt: {type: Date, default: Date.now} 
});

dealSchema.methods.serialize = function() {
    return {
        id: this._id,
        dealName: this.dealName,
        productCategory: this.productCategory,
        price: this.price,
        image: this.image,
        seller: this.seller,
        productDescription: this.productDescription,
        dealLink: this.dealLink,
        user: this.user,
        comments: this.comments,
        createdAt: this.createdAt
    };
};

const Deal = mongoose.model('Deal', dealSchema);

module.exports = {Deal};