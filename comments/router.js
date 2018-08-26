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
            $push: {comments: {comment: req.body.userComment, user: req.user.id, username: req.user.username, deal_id: req.params.dealId}}
        }, {new: true})
        .then(deal => res.status(201).json(deal.comments))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.delete('/:commentId/:dealId', (req, res) => {
    Deal
        .findOneAndUpdate({_id: req.params.dealId}, { 
            $pull: {comments: {_id: req.params.commentId}}
        })
        .then(() => {
            res.status(204).end();
        }
        )
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

module.exports = {router};