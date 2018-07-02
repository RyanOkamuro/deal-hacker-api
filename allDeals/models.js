'use strict';

const mongoose = require('mongoose');

const dealSchema = mongoose.Schema({
    dealName: {type: String, required: true},
    productCategory: {type: String, required: true},
    price: {type: Number, required: true},
    details: {type: String, required: false},
    image: {type: String, required: true},
    seller: {type: String, required: true},
    favorite: {type: String, required: false},
    favoriteClass: {type: String, required: false},
    productDescription: {type: String, required: true},
    dealLink: {type: String, required: true},
    comments: [{
        comment: {type: String},
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }]
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
        dealLink: this.dealLink,
        comments: this.comments
    };
}

const Deal = mongoose.model('Deal', dealSchema);

module.exports = {Deal};