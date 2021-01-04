const express = require('express');
const AdminUser = require('../model/AdminUser');
const bcrypt = require('bcryptjs'); //引入bcrypt加密
const jwt = require('jsonwebtoken'); //引入jwt
const router = express.Router();
const { secret } = require('../config/key');
const userfilter = { password: 0, __v: 0 };//指定过滤属性
const adminUserFilter = { __v: 0, password: 0 }
const today = new Date(Date.now()).getTime()
const isTokenTimeout = async (req, res, next) => { // 用于判断token是否超时
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ').pop();
    if (token) {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          return res.status(401).send({ code: 1001, msg: '检测Token超时' });
        } else {
          next();
        }
      });
    }
  } else {
    return res.send('headerse authorization none');
  }
};
//验证身份中间件
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(' ').pop();
  const { _id, username } = jwt.verify(token, secret); //解析token。并取出_id和username
  const user = await AdminUser.findById(_id);
  if (!user) { return res.status(422).send({ code: 1000, msg: '该token用户不存在' }) }
  if (username !== user.username) {
    res.status(422).send({ code: 1000, msg: '用户错误' })
  } else {
    if (!user.isAdmin) {
      res.status(409).send({ code: 1002, msg: '没有权限' })
    } else {
      next()
    }
  }
};

const AdminUserByIdUpdate = (_id, a) => new Promise((resolve, reject) => {
  AdminUser.findByIdAndUpdate(_id, a, (err, oldV) => {
    if (!err) {
      resolve()
    } else {
      reject();
    }
  })
})


// 创建用户和编辑用户
router.post('/editAdminUser', async (req, res) => {
  const { username, name, isAdmin, _id } = req.body
  if (_id === '') {
    AdminUser.findOne({ username }, adminUserFilter, (err, user) => {
      if (user) {
        res.status(422).send({ code: 0, msg: '已经存在' })
      } else {
        delete (req.body['_id'])
        new AdminUser(req.body).save((err, newUser) => {
          res.status(201).send({ code: 1, msg: '创建成功' })
        });
      }
    })
  } else {
    await AdminUserByIdUpdate(_id, { username, name, isAdmin })
      .then(() => res.status(201).send({ code: 1, msg: '管理员信息修改成功' }))
      .catch(() => res.status(422).send({ code: 0, msg: '管理员信息修改失败' }))
  }
});

// 添加权限拦截
router.post('/editAdminUserPassword', isTokenTimeout);
router.post('/editAdminUserPassword', isAdmin);
// 修改密码
router.post('/editAdminUserPassword', async (req, res) => {
  const { password, _id } = req.body
  await AdminUserByIdUpdate(_id, { password })
    .then(() => res.status(201).send({ code: 1, msg: '密码修改成功' }))
    .catch(() => res.status(422).send({ code: 0, msg: '密码修改失败' }))
})

// 添加权限拦截
router.delete('/deleteAdminUser', isTokenTimeout);
router.delete('/deleteAdminUser', isAdmin);
// 删除用户
router.delete('/deleteAdminUser', async (req, res) => {
  const { _id } = req.query
  AdminUser.remove({ _id }, adminUserFilter, (err, doc) => {
    if (!err) {
      if (doc.n === 1) {
        res.status(201).send({ code: 1, msg: '删除成功' })
      } else {
        res.status(422).send({ code: 0, msg: '尚未找到该用户' })
      }
    } else {
      res.status(422).send({ code: 0, msg: '删除错误' })
    }
  })
});

const setToken = (_id, username) => {
  //token采用JWT标准模式,其中refreshToken用做刷新token
  const token = jwt.sign({ _id, username }, secret, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ _id, username }, secret, { expiresIn: '25h' });
  return [token, refreshToken]
}

//登陆
router.post('/login', async (req, res) => {
  const user = await AdminUser.findOne({ username: req.body.username });
  if (!user) { return res.status(422).send({ code: 0, msg: '该用户不存在' }) }
  let isPassword = await bcrypt.compareSync(req.body.password, user.password);
  if (!isPassword) { return res.status(422).send({ code: 0, msg: '密码错误' }) }
  const { _id, username } = user
  const [token, refreshToken] = setToken(_id, username)
  AdminUserByIdUpdate(_id, { loginTime: today })
  return res.send({ code: 1, msg: '成功生成token', data: { token, refreshToken } });
});

//登陆
router.post('/logout', async (req, res) => {
  res.status(202).send({ code: 1, msg: '请重新登录账号' });
});

router.post('/refreshtoken', async (req, res) => {
  const token = req.body.refreshAuthorization.split(' ').pop();
  jwt.verify(token, secret, async (error, dec) => {
    if (error) {
      res.status(401).send({ code: 1003, msg: '检测refreshToken超时' })
    } else {
      const { _id, username } = dec
      const user = AdminUser.findOne({ username: username });
      if (!user) res.status(422).send({ code: 0, msg: '该用户不存在' })
      const [token, refreshToken] = await setToken(_id, username)
      res.send({ code: 1, msg: '成功续约token', data: { token, refreshToken } });
    }
  });
});

router.post('/getAdminUserList', isTokenTimeout);
router.post('/getAdminUserList', async (req, res) => {
  let page = req.body.page;
  let rows = req.body.rows;
  AdminUser.find({}, adminUserFilter, (err, list) => {
    if (!err) {
      res.send({ code: 1, msg: '成功获取管理员用户列表', data: { total: list.length, data: list } });
    } else {
      res.status(422).send({ code: 0, msg: '查询错误' })
    }
  }).skip((page - 1) * rows).limit(rows * 1)
});

router.get('/', isTokenTimeout)
//验证身份,并返回用户信息
router.get('/', async (req, res, next) => {
  const token = req.headers.authorization.split(' ').pop()
  //解析token。并取出_id和username
  const { _id, username } = jwt.verify(token, secret)
  const user = await AdminUser.findById(_id, userfilter);
  if (!user) { return res.status(401).send({ code: 0, msg: '该用户不存在' }) }
  if (
    username !== user.username) {
    res.status(401).send({ code: 0, msg: '用户错误' })
  } else {
    res.send({ code: 1, msg: '成功续约token', data: { _id: user._id, name: user.name, username: user.username, isAdmin: user.isAdmin } });
  }
})

module.exports = {
  usersRouter: router,
  isTokenTimeout,
  isAdmin
};
