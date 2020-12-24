const express = require('express');
var multer = require('multer');
const File = require('../model/File');
var fs = require("fs"); //引入fs，fs 是node中一个文件操作模块，包括文件创建，删除，查询，读取，写入。
const router = express.Router();
var moment = require('moment');
const path = require('path');
const { isTokenTimeout, isAdmin } = require('./users');

var timestamp = '';
var timepath = moment().format('YYYY-MM-DD');
var destination = '/upload/images/' + timepath;
var filename = '';


var storage = multer.diskStorage({
  //这里destination是一个字符串
  destination: '.' + destination,
  filename: function (req, file, cb) {
    //自定义设置文件的名字
    timestamp = new Date().getTime();
    filename = 'upload-' + timestamp + '.' + file.originalname.split('.')[1];
    cb(null, filename)
  }
})

var upload = multer({
  storage: storage
});


// 添加权限拦截
router.post('/uploadSingleImage', isTokenTimeout);
router.post('/uploadSingleImage', isAdmin);
//处理来自页面的ajax请求。单文件上传
//多文件上传使用upload.array('file', number)
router.post('/uploadSingleImage', upload.single('imageFile'), function (req, res,) {
  //拼接文件上传后的路径
  const { description } = req.body
  const { mimetype, size } = req.file
  const url = destination + '/' + filename;
  new File({ description, type: mimetype, size, url }).save((err, newVal) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '上传成功', data: { imageUrl: url } })
    } else {
      fs.unlinkSync(url)
      res.status(422).send({ code: 0, msg: '上传失败，存储数据库失败' })
    }
  })
});


const FileDelete = (url) => new Promise((resolve, reject) => {
  if (url.substr(0, 4) === "http") reject();
  File.remove({ url: "/" + url }, (err, oldV) => {
    if (!err) {
      try {
        fs.unlinkSync(url)
      } catch (e) {
        reject();
      }
      resolve();
    } else {
      reject();
    }
  })
})


// 添加权限拦截
router.delete('/delete', isTokenTimeout);
router.delete('/delete', isAdmin);
router.delete('/delete', upload.single('imageFile'), function (req, res,) {
  let { _id } = req.query
  File.findById(_id).exec((err, newVal) => {
    if (!err) {
      let imageUrl = newVal.imageUrl
      const len = imageUrl.length
      if (imageUrl.substr(0, 1) === "/") {
        imageUrl = imageUrl.substring(1, len);
      }
      if (imageUrl.substr(0, 4) === "http") {
        res.status(422).send({ code: 0, msg: '非本后端图片' })
      }
      FileDelete(imageUrl).then(() => {
        res.status(200).send({ code: 1, msg: '删除成功' })
      }).catch(() => {
        res.status(422).send({ code: 0, msg: '删除失败' })
      })
    } else {
      res.status(422).send({ code: 0, msg: '删除失败' })
    }
  })

});

router.get('/download', upload.single('imageFile'), function (req, res,) {
  const query_param = req.query
  let imageUrl = query_param.imageUrl
  const len = imageUrl.length
  if (imageUrl.substr(0, 1) === "/") {
    imageUrl = imageUrl.substring(1, len);
  }
  if (query_param !== undefined) {
    File.findOneAndUpdate({ url: '/' + imageUrl }, { $inc: { downloadCount: 0.5 } }, { new: true }, (err, doc) => {
      if (!err) {
        res.status(200).download(imageUrl)
      } else {
        res.status(422).send({ code: 0, msg: '下载失败' })
      }
    })

  }
});

module.exports = { fileRouter: router, FileDelete };