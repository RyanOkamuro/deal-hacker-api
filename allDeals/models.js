'use strict';

const mongoose = require('mongoose');

const dealSchema = mongoose.Schema({
    dealName: {type: String, required: true},
    productCategory: {type: String, required: true},
    price: {type: Number, required: true},
    details: "Details",
    image: {type: String, required: true},
    seller: {type: String, required: true},
    favorite: "https://i.stack.imgur.com/LQk8v.png",
    favoriteClass: "favorite",
    productDescription: {type: String, required: true},
    dealLink: {type: String, required: true}
})