const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User} = require('../users/models');

router.get('/', (req,res) => {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!", req.params);
  console.log("!!!!!!!!!!!!!!!!!!!!!!!", req.body);
    User
    .findById(req.user.id)
    .populate("favorites")
    .then(User => res.json(User.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['id'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
    console.log("!!!!!!!!!!!!!!!!!!!!!!!", req.user);
    console.log("!!!!!!!!!!!!!!!!!!!!!!!", req.body);
      User
      .findOneAndUpdate({_id: req.user.id}, { 
        $push: {favorites: req.body.id}
      })
      .populate("favorites")
      .then(user => res.status(201).json(user.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
  });
  
//   router.put('/:id', jsonParser, (req, res) => {
//     if (!(req.params.id && req.body.id === req.body.id)) {
//       const message = (
//         `Request path id (${req.params.id}) and request body id ` +
//         `(${req.body.id}) must match`);
//       console.error(message);
//       return res.status(400).json({message: message});
//     }
//     const toUpdate = {};
//     const updateableFields = ['dealName', 'productCategory', 'price', 'image', 'seller', 'productDescription', 'dealLink'];
//     updateableFields.forEach(field => {
//       if (req.body[field]) {
//         toUpdate[field] = req.body[field];
//       }
//     });
//       Deal
//       .findByIdAndUpdate(req.params.id, {$set: toUpdate})
//       .then(dealItem => {return res.status(202).json(dealItem)})
//       .catch(err => res.status(500).json({message: 'Internal server error'}));
//   });

  router.delete('/:id', (req, res) => {
    User
    .findOneAndUpdate({_id: req.user.id}, { 
      $pull: {"favorites": req.params.id}
    })
    .populate("favorites")
    .then(user => {
      console.log(user)
      res.status(204).end()
    }
  )
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'});
    })
  });

module.exports = {router};