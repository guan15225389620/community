const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
const nameMinLength = 2;
const nameMaxLength = 10;
const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
const commentDefault = '这家伙很懒，什么都没有留下...';
const logoDefault = '/images/default_logo.jpg';

module.exports = {
    pwdReg, 
    nameMinLength,
    nameMaxLength,
    emailReg,
    commentDefault,
    logoDefault
}