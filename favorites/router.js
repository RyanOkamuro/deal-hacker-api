const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User} = require('../users/models');

router.get('/', (req,res) => {
    User
        .findById(req.user.id)
        .populate('favorites')
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
    return User
        .findOne({_id: req.user.id})
        .exec()
        .then(user => {
            if(user.favorites.indexOf(req.body.id) > -1){
                return res.status(200).json({message: 'Favorite exists'});
            }
            return user;
        })
        .then(user => {
            return User.findOneAndUpdate({
                _id: user.id
            },
            { 
                $push: {favorites: req.body.id}
            }, {upsert: true})
                .populate('favorites')
                .then(user => res.status(201).json(user.serialize()))
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({message: 'Internal server error'});
                });
        });
});

router.delete('/:id', (req, res) => {
    User
        .findOneAndUpdate({_id: req.user.id}, { 
            $pull: {'favorites': req.params.id}
        })
        .populate('favorites')
        .then(user => {
            res.status(204).end();
        }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

module.exports = {router};