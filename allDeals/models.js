'use strict';

const mongoose = require('mongoose');

const dealSchema = mongoose.Schema({
    dealName: {type: String, required: true},
    productCategory: {type: String, required: true},
    price: {type: Number, required: true},
    details: {type: String, required: true},
    image: {type: String, required: true},
    seller: {type: String, required: true},
    favorite: {type: String, required: true},
    favoriteClass: {type: String, required: true},
    productDescription: {type: String, required: true},
    dealLink: {type: String, required: true}
});

dealSchema.methods.serialize = function() {
    return {
        id: this._id,
        dealName: this.dealName,
        productCategory: this.productCategory,
        price: this.price,
        details: this.details,
        image: this.image,
        seller: this.seller,
        favorite: this.favorite,
        favoriteClass: this.favoriteClass,
        productDescription: this.productDescription,
        dealLink: this.dealLink
    };
}

const Deal = mongoose.model('Deal', dealSchema);

module.exports = {Deal};