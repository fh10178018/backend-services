const express = require('express');
const router = express.Router();
const { Blog, BlogType } = require('../model/Blog');
const today = new Date(Date.now()).getTime()
const { isTokenTimeout, isAdmin } = require('./users');
const { FileDelete } = require('./file');

router.get('/getBlogType', async (req, res) => {
  BlogType.find((err, doc) => {
    if (!err) {
      return res.send({ code: 1, msg: '获取日志类别', data: doc });
    } else {
      res.status(422).send({ code: 0, msg: '获取日志类别失败' })
    }
  })
})

// 添加权限拦截
router.post('/editBlogType', isTokenTimeout);
router.post('/editBlogType', isAdmin);
router.post('/editBlogType', async (req, res) => {
  const { _id, name } = req.body
  if (_id === '') {
    await BlogType.findOne({ name }, (err, type) => {
      if (type) {
        res.status(422).send({ code: 0, msg: req.name + ' 类型已经存在' })
      } else {
        delete (req.body['_id'])
        new BlogType(req.body).save((err, newVal) => {
          if (!err) {
            res.status(201).send({ code: 1, msg: '创建成功' })
          } else {
            res.status(422).send({ code: 0, msg: '创建失败' })
          }
        });
      }
    })
  } else {
    delete (req.body['_id'])
    await BlogType.findByIdAndUpdate(_id, req.body, (err, oldV) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '日志类型修改成功' })
      } else {
        res.status(422).send({ code: 0, msg: '日志类型修修改失败' })
      }
    })
  }
})

router.post('/getBlogList', async (req, res) => {
  const { page, rows, type } = req.body
  if (type !== '') {
    Blog
      .$where(`this.types.indexOf("${type}") !== -1`)
      .skip((page - 1) * rows).
      limit(rows * 1)
      .exec(function (err, list) {
        if (!err) {
          res.send({ code: 1, msg: '成功获取日志列表', data: { total: list.length, data: list } });
        } else {
          res.status(422).send({ code: 0, msg: '查询错误' })
        }
      })
  } else {
    Blog.find({}, (err, list) => {
      if (!err) {
        res.send({ code: 1, msg: '成功获取日志列表', data: { total: list.length, data: list } });
      } else {
        res.status(422).send({ code: 0, msg: '查询错误' })
      }
    }).skip((page - 1) * rows).limit(rows * 1)
  }
});

const BlogyIdUpdate = (_id, a) => new Promise((resolve, reject) => {
  Blog.findByIdAndUpdate(_id, { ...a, editTime: today }, (err, oldV) => {
    if (!err) {
      resolve()
    } else {
      reject();
    }
  })
})

// 添加权限拦截
router.post('/editBlog', isTokenTimeout);
router.post('/editBlog', isAdmin);
router.post('/editBlog', async (req, res) => {
  const { _id } = req.body
  if (_id === '') {
    delete (req.body['_id'])
    await new Blog(req.body).save((err, newUser) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '创建成功' })
      } else {
        res.status(422).send({ code: 0, msg: '创建失败' })
      }
    });
  } else {
    delete (req.body['_id'])
    await BlogyIdUpdate(_id, { ...req.body, editTime: today })
      .then(() => res.status(201).send({ code: 1, msg: '日志修改成功' }))
      .catch(() => res.status(422).send({ code: 0, msg: '日志修改失败' }))
  }
});

router.post('/giveALike', async (req, res) => {
  const { _id } = req.body
  await Blog.findByIdAndUpdate(_id, { $inc: { likeNums: 1 } }, { new: true }, (err, newVal) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '点赞成功', data: { likeNums: newVal.likeNums } })
    } else {
      res.status(422).send({ code: 0, msg: '查无此日志，请刷新一下页面' })
    }
  })
});

router.post('/increaseTheBrowse', async (req, res) => {
  const { _id } = req.body
  await Blog.findByIdAndUpdate(_id, { $inc: { viewNums: 1 } }, { new: true }, (err, newVal) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '增加浏览量', data: { viewNums: newVal.viewNums } })
    } else {
      res.status(422).send({ code: 0, msg: '查无此日志，请刷新一下页面' })
    }
  })
});

// 添加权限拦截
router.delete('/deleteBlog', isTokenTimeout);
router.delete('/deleteBlog', isAdmin);
router.delete('/deleteBlog', async (req, res) => {
  const { _id } = req.body
  Blog.findById(_id, (err, newVal) => {
    if (!err) {
      const imageUrl = newVal.imageUrl
      Blog.remove({ _id }, (err, doc) => {
        if (!err) {
          if (doc.n === 1) {
            FileDelete(imageUrl)
            res.status(201).send({ code: 1, msg: '删除日志成功' })
          } else {
            res.status(422).send({ code: 0, msg: '尚未找到该日志' })
          }
        } else {
          res.status(422).send({ code: 0, msg: '删除错误' })
        }
      })
    } else {
      res.status(422).send({ code: 0, msg: '尚未找到该日志' })
    }
  })
});

module.exports = router;