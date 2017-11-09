var app = angular.module('community', ['ngCookies']);
app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
app.controller('mainController', mainController);
app.controller('registerController', registerController);
app.controller('loginController', loginController);
app.controller('forgetController', forgetController);
app.controller('resetController', resetController);
app.controller('articlePostController', articlePostController);
app.controller('articleDetailController', articleDetailController);
app.controller('articleEditController', articleEditController);
app.controller('settingController', settingController);

function mainController($scope) {

}

function registerController($scope, $http) {
    $scope.agree = true;
    $scope.register = function () {
        // 1. 添加客户端验证(只验证了密码和确认密码是否相同，正式开发中要做全面验证)
        if ($scope.password != $scope.confirmPassword) {
            layer.msg('密码和确认密码不一致！')
            return;
        }

        // 2. 发起请求
        $http.post('/users/register', {
            name: $scope.name,
            email: $scope.email,
            password: $scope.password
        })
            .then(function (res) {
                if (res.data.code != 200) {
                    layer.msg(res.data.message);
                    return;
                }
                location.href = '/';
            }, function (err) {
                console.log(err);
            })
    }
}

function loginController($scope, $http, $cookies) {
    $scope.remember = false;
    $scope.name = $cookies.get('account');

    $scope.login = function () {
        $http.post('/users/login', {
            name: $scope.name,
            password: $scope.password
        })
            .then(function (res) {
                if (res.data.code != 200) {
                    layer.msg(res.data.message);
                    return;
                }
                if ($scope.remember) {
                    $cookies.put('account', $scope.name, { expires: new Date(Date.now() + 1000 * 60 * 60 * 8) });
                }
                location.href = '/';
            }, function (err) {
                console.log(err);
            })
    }
}

function forgetController($scope, $http) {
    $scope.forget = function () {
        $http.post('/users/forget', { email: $scope.email })
            .then(function (res) {
                if (res.data.code != 200) {
                    layer.msg(res.data.message);
                    return;
                }
                location.href = '/users/success'
            }, function (err) {
                console.log(err);
            })
    }
}

function resetController($scope, $location, $http, $document) {

    $scope.reset = function () {
        if ($scope.password != $scope.confirmPassword) {
            layer.msg('密码和确认密码不一致！');
            return;
        }
        // console.log($document.find('#email').val());
        // console.log($document[0].resetForm.email.value);
        // console.log($('#email').val());
        $http.post('/users/reset', {
            email: $document[0].resetForm.email.value,
            password: $scope.password
        }).then(function (res) {
            if (res.data.code != 200) {
                layer.msg(res.data.message);
                return;
            }
            location.href = '/users/login';
        }, function (err) {
            console.log(err);
        })
    }
}

function articlePostController($scope, $document, $http) {
    // 是否是空值
    $scope.isEmpty = true;
    // 是否是第一次加载页面
    $scope.isFirst = true;
    var simplemde = new SimpleMDE({
        element: $("#content")[0],
        status: false,
        styleSelectedText: false
    });
    simplemde.codemirror.on("change", function () {
        $scope.isEmpty = simplemde.value().length > 0 ? false : true;
        $scope.isFirst = false;
        $scope.$apply();
    });

    $scope.post = function () {
        $http.post('/articles/post', {
            category: $scope.category,
            title: $scope.title,
            content: simplemde.value()
        }).then(function (res) {
            if (res.data.code != 200) {
                layer.msg(res.data.message);
                return;
            }
            location.href = '/';
        }, function (err) {
            console.log(err);
        })
    }
}

function articleDetailController($scope, $http) {
    // event = $event服务
    // 通过$event服务可以获取到当前点击的元素 event.currentTarget
    // angular.js中默认带有一个精简版的jQ,angular.js对精简版的jQ做了特殊的处理
    // 不用担心会和视图引入的jquery.js冲突
    $scope.topReply = function (event) {
        // 获取当前点击的的按钮所在的from表单元素
        // console.log(event.currentTarget)
        // console.log($(event.currentTarget))
        // 查找离当前点击的按钮最近的form元素，目的：通过form元素去查找富文本simplemde
        var targetForm = $(event.currentTarget).closest('form');
        // targetForm.find('.reply_editor').data('editor')获取simpleMDE
        var content = targetForm.find('.reply_editor').data('editor').value();

        var parentId = $(event.currentTarget).closest('.aw-item').data('id');
        if (!content) {
            layer.msg('请输入回复内容！');
            return;
        }

        $http.post('/articles/reply', {
            articleId: $('#articleid').val(),
            content: content,
            parentId: parentId || null
        }).then(function (res) {
            if (res.data.code != 200) {
                if (res.data.code == 202) {
                    location.href = '/users/login';
                } else {
                    layer.msg(res.data.message);
                }
                return;
            }
            location.href = '/articles/detail/' + $('#articleid').val();
        }, function (err) {
            console.log(err);
        })
    }

    // 此方法返回一段HTML
    $scope.showReply2 = function (event) {
        // 一级回复的容器
        var parent = $(event.currentTarget).closest('.aw-item');
        // 一个容器，把服务器端返回的HTML片段放到此容器中（二级回复列表的容器）
        var commentItem = parent.find('.aw-comment-box');
        if (commentItem.css('display') == 'none') {
            // ${parent.data('id')}获取二级回复的父级ID
            $http.post(`/articles/showReply2/${parent.data('id')}`).then(function (res) {
                if (res.data.code == 202) {
                    location.href = '/users/login';
                    return;
                }
                commentItem.find('.aw-comment-list').prepend(res.data);
                commentItem.fadeToggle('fast');
            }, function (err) {
                console.log(err);
            });
        } else {
            // 隐藏前把aw-comment-list中的除form外所有子元素删除
            commentItem.find('.aw-comment-list').children().not('form').remove();
            commentItem.fadeToggle('fast');
        }
    }

    $scope.removeArticle = function (event) {
        $http.post('/articles/remove', {
            id: $(event.currentTarget).data('id'),
            articleUserId: $(event.currentTarget).data('article-user-id'),
        }).then(function (res) {
            if (res.data.code != 200) {
                layer.msg(res.data.message);
                return;
            }
            location.href = '/';
        }, function (err) {
            console.log(err);
        })
    }
}

function articleEditController($scope, $http) {
    $scope.isEmpty = true;
    var simplemde = new SimpleMDE({
        element: $("#content")[0],
        status: false,
        styleSelectedText: false
    });
    simplemde.codemirror.on("change", function () {
        if (simplemde.value().length > 0) {
            $scope.isEmpty = true;
        } else {
            $scope.isEmpty = false;
        }
        $scope.$apply();
    });

    $scope.edit = function () {
        $http.post('/articles/edit', {
            id: $scope.id,
            category: $scope.category,
            title: $scope.title,
            content: simplemde.value()
        }).then(function (res) {
            if (res.data.code != 200) {
                layer.msg(res.data.message);
                return;
            }
            location.href = '/';
        }, function (err) {
            console.log(err);
        })
    }
}

function settingController($scope, $http) {
    $scope.setting = function () {
        $http.post('/users/setting', {
            comments: $scope.comments
        }).then(function (res) {
            if (res.data.code == 200) {
                layer.msg('保存成功!');
                $scope.comments = "";
                return;
            }
            layer.msg(res.code.message);
        }, function (err) {
            console.log(err);
        })
    }
}