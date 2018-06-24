const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Deal} = require('./models');

router.get('/', (req, res) => {
    Deal 
    .find({}).exec()
    .then(dealItem => {
        res.json({
            dealItem: dealItem.map(
                (Deal) => Deal.serialize())
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req,res) => {
    Deal
    .findById(req.params.id)
    .then(Deal => res.json(Deal.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['dealName', 'productCategory', 'price', 'image', 'seller', 'productDescription', 'dealLink'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
      Deal
      .create({
        dealName: req.body.dealName,
        productCategory: req.body.productCategory,
        price: req.body.price,
        details: req.body.details,
        image: req.body.image,
        seller: req.body.seller,
        favorite: req.body.favorite,
        favoriteClass: req.body.favoriteClass,
        productDescription: req.body.productDescription,
        dealLink: req.body.dealLink,
      })
      .then(dealItem => res.status(201).json(dealItem.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
  });
  

router.use('*', function(req, res) {
    res.status(404).json({message: 'Not found'});
  });

module.exports = {router};