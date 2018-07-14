const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Deal} = require('../allDeals/models');

router.post('/:dealId', jsonParser, (req, res) => {
    const requiredFields = ['userComment'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Deal
        .findOneAndUpdate({_id: req.params.dealId}, { 
            $push: {comments: {comment: req.body.userComment, user: req.user.id, username: req.user.username, _id: req.params.dealId}}
        }, {new: true})
        .then(deal => res.status(201).json(deal.comments))
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
//     const updateableFields = ['userComment'];
//     updateableFields.forEach(field => {
//       if (req.body[field]) {
//         toUpdate[field] = req.body[field];
//       }
//     });
//       Comment
//       .findByIdAndUpdate(req.params.id, {$set: toUpdate})
//       .then(usersComment => {return res.status(202).json(usersComment)})
//       .catch(err => res.status(500).json({message: 'Internal server error'}));
//   });

//   router.delete('/:id', (req, res) => {
//     Comment
//     .findByIdAndRemove(req.params.id)
//     .then(usersComment => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
//   });

// router.use('*', function(req, res) {
//     res.status(404).json({message: 'Not found'});
//   });

module.exports = {router};