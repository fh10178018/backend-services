const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') //引入bcrypt加密
const { Schema, model } = mongoose
const today = new Date(Date.now()).getTime()
//1、定义特定集合的Model并向外暴露
//1.1、定义文档结构
const AdminUserSchema = new Schema({
  username: { type: String, required: true },//用户账号
  password: {
    type: String,
    required: true,
    set (val) {//获取密码时进行加密
      return bcrypt.hashSync(val, 10)
    }
  },//密码
  name: { type: String, required: false }, //用户姓名
  creatTime: { type: Number, default: today },
  loginTime: { type: Number, default: today },
  isAdmin: { type: Boolean, default: false },//身份 1=>管理员 ，0=》普通用户
})
//1.2、定义Model（与集合对应，可以操作集合）
const AdminUser = model('AdminUser', AdminUserSchema)
//1.3、向外暴露
module.exports = AdminUser


