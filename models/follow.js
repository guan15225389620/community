var mongoose = require('../modules/database.js');

var schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    followUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    createTime: {
        type: Date,
        default: Date.now
    }
});

schema.statics = {

}

var Model = mongoose.model('follows', schema);

module.exports = Model;