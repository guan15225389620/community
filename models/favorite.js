var mongoose = require('../modules/database.js');

var schema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'articles'
    },
    userId: {
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

var Model = mongoose.model('favorites', schema);

module.exports = Model;