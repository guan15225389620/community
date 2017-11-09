$(function () {
    $('#file_upload').uploadify({
        auto: true,
        swf: '/libs/uploadify/uploadify.swf',
        uploader: '/users/jupload',
        // Put your options here
        buttonText: '<div>选择文件</div>',
        formData: {
            userId: $('#userId').val(),
            userName: $('#userName').val(),
        },
        onUploadSuccess: function (file, data, response) {
            console.log(file);
            console.log(data);
            console.log(response);
            var img = "<img src=\"" + data + "\"/>";
            $("#queue").append(img);
        }
    });
})