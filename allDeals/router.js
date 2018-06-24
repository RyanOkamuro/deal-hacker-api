const express = require('express');
const router = express.Router();

const {Deal} = require('./models');

router.get('/', (req, res) => {
    Deal 
    .find({}).exec()
    .then(deal => {
        res.json({
            deal: deal.map(
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

router.use('*', function(req, res) {
    res.status(404).json({message: 'Not found'});
  });

module.exports = {router};