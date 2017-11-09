var mongoose = require('../modules/database.js');
var constant = require('../modules/constant.js');
var sendEmail = require('../modules/email.js');
var secure = require('../modules/secure.js');
var config = require('../modules/config.js');
// 创建全局的Schema对象
var Schema = mongoose.Schema;

// 通过全局的Schema对象， 创建数据库映射架构(Schema)实例
var schema = new Schema({
    name: {
        type: String,
        require: true,
        minlength: constant.nameMinLength,
        maxlength: constant.nameMaxLength
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        match: constant.emailReg
    },
    comments: {
        type: String,
        default: constant.commentDefault
    },
    logo: {
        type: String,
        default: constant.logoDefault
    },
    score: {
        type: Number,
        default: 0
    },
    articleCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        type: Number,
        default: 0
    },
    followCount: {
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

// 在映射的架构上定义静态方法，在接口中可以通过数据模型去调用架构上的静态方法
schema.statics = {
    // 注册
    register: function (data, cb) {
        // 查询账号是否存在或者邮箱是否存在
        var filter = [{ name: data.name }, { email: data.email }];
        Model.findOne().or(filter).exec(function (err, result) {
            if (err) {
                return cb({ code: 201, message: err });
            }

            if (result) {
                return cb({ code: 201, message: "注册的信息已存在" });
            } else {
                Model.insertMany(data, function (err, result) {
                    if (err) {
                        return cb({ code: 201, message: err });
                    }

                    return cb(null, result);
                })
            }
        });
    },
    // 登录
    login: function (data, cb) {
        var filter = {
            $or: [
                { name: data.account, password: data.password },
                { email: data.account, password: data.password }
            ]
        };
        Model.findOne(filter, function (err, result) {
            if (err) {
                return cb({ code: 201, message: err });
            }
            if (!result) {
                return cb({ code: 201, message: '账号或密码错误！' });
            }
            return cb(null, { code: 200, result });
        })
    },
    // 忘记密码
    forget: function (data, cb) {
        Model.findOne({ email: data.email }, function (err, result) {
            if (err) {
                return cb({ code: 201, message: err });
            }
            if (!result) {
                return cb({ code: 201, message: '邮箱不存在' });
            }
            // 发送邮件
            var link = `${data.email}`;
            link = secure.encrypt(link, config.key);
            var content = `
            <h2>密码找回</h2>
            访问地址：
            <a href='http://localhost:8000/users/reset?email=${link}'>http://localhost:8000/users/reset?email=${link}</a>
            `
            sendEmail(result.email, '找回密码', content, function (err, res) {
                if (err) {
                    console.log(err)
                    return cb({ code: 201, message: '发送邮件失败！' });
                }

                return cb(null, { code: 200, message: '邮件发送成功!' });
            });
        })
    },
    // 重置密码
    reset: function (data, cb) {
        Model.findOneAndUpdate({ email: data.email }, { $set: { password: data.password } }, function (err, result) {
            if (err) {
                return cb({ code: 201, message: '重置密码失败！' });
            }
            return cb(null, { code: 200, message: result });
        })
    }
}

// 创建全局数据模型（Model），可以通过调用全局数据模型构造函数创建实体(Entity)
var Model = mongoose.model('users', schema);

module.exports = Model;