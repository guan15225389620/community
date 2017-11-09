// 封装加密和解密模块
var crypto = require('crypto');

function encrypt(data, key) { // 密码加密
    var cipher = crypto.createCipher("bf", key);
    var newPsd = "";
    newPsd += cipher.update(data, "utf8", "hex");
    newPsd += cipher.final("hex");
    return newPsd;
}
function decrypt(data, key) { //密码解密
    var decipher = crypto.createDecipher("bf", key);
    var oldPsd = "";
    oldPsd += decipher.update(data, "hex", "utf8");
    oldPsd += decipher.final("utf8");
    return oldPsd;
}

module.exports = {
    encrypt,
    decrypt
}