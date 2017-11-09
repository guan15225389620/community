var mongoose = require('../modules/database.js');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

schema.statics = {

}

var Model = mongoose.model('categories', schema);

module.exports = Model;