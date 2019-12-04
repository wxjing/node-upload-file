var fs = require("fs");
var path = require('path');
var multer = require('multer');//用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。  https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
var express = require('express');

var app = express();

app.use('/upload', express.static('upload'));//设置静态文件路径

app.use(multer({ dest: 'tmp/' }).array('filename'));//multer 会自动创建 tmp 目录;  filename:html表单name值

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

app.post('/upload', function (req, res) {

    console.log(req.files);  // 上传的文件信息

    // upload 目录需要手动创建
    var des_file = "./upload/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                response = {
                    message: err
                };
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname,
                    path: `http://localhost:8081/` + des_file
                };
            }
            res.end(JSON.stringify(response));
        });
    });
})

// 下载
app.get('/upload/:file', function (req, res, next) {
    var filePath = path.join(__dirname, 'upload', req.params.file);
    res.download(filePath, function (err) {
        if (!err) return; // file sent
        if (err.status !== 404) return next(err); // non-404 error
        res.statusCode = 404;
        res.send('Cant find that file, sorry!');
    });
});

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})