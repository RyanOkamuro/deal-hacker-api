'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userComment: {type: String, required: true},
});

commentSchema.methods.serialize = function() {
    return {
        id: this._id,
        userComment: this.userComment,
    };
}

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {Comment};