var check = {
    login: function (req, res, next) {
        if (!req.session.user) {
            res.render('users/login', {
                title: '登录',
                user: req.session.user
            })

            return;
        }
        next();
    },
    // 客户端发起ajax请求后，如果未登录，跳转到本页面时使用此管线。
    ajaxLogin: function (req, res, next) {
        if (!req.session.user) {
            res.json({ code: 202, message: '未登录' });
            return;
        }
        next();
    },
    logined: function (req, res, next) {
        if (req.session.user) {
            res.render('error.ejs', {
                title: '错误页',
                message: '服务器拒绝访问，原因：已登录',
                error: { status: 403, stack: '已登录！' },
                user: req.session.user
            })
            return;
        }
        next();
    }
}

module.exports = check;