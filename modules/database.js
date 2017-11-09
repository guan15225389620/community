// 封装数据库模块
// 作用：
// 1. 把数据库打开
// 2. 把mongoose导出，在别的模块中使用
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/community', { useMongoClient: true, promiseLibrary: global.Promise });
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('数据库连接失败，原因：' + err);
})
db.once('open', function () {
    console.log('数据库连接成功！')
});
module.exports = mongoose;