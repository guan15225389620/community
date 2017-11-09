// 引入操作数据库的模块mongoose
var mongoose = require('../modules/database.js');
var moment = require('moment');
moment.locale('zh-cn');
// 映射架构
var schema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'categories'
    },
    tags: {
        type: mongoose.Schema.Types.Array
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    browerCount: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    favoriteCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        type: Number,
        default: 0
    },
    lastReplyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'replies',
        default: null
    },
    status: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
});

// 虚拟字段（属性）只读
schema.virtual('createTimeFormat').get(function(){
    return moment(this.createTime).startOf('hour').fromNow();
})

schema.statics = {
    // 发布
    post: function (data, cb) {
        Model.create(data, function (err, result) {
            if (err) {
                return cb({ code: 201, message: err });
            }
            cb(null, { code: 200, message: '保存成功!' })
        })
    }
}

// 创建模型
var Model = mongoose.model('articles', schema);

// 导出模型
module.exports = Model;
