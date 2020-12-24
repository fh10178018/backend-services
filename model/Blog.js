const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') //引入bcrypt加密
const { Schema, model } = mongoose
const today = new Date(Date.now()).getTime()
//1、定义特定集合的Model并向外暴露
//1.1、定义文档结构
const BlogSchema = new Schema({
  title: { type: String, required: true },//标题
  introduction: { type: String, required: true },//介绍
  imageUrl: { type: String, required: true },//图片地址
  content: { type: String, required: true }, //内容
  creatTime: { type: Number, default: today },//创建时间
  editTime: { type: Number, default: today },//修改时间
  types: { type: Array, required: true },//类别
  likeNums: { type: Number, default: 0 },
  viewNums: { type: Number, default: 0 }
})
//1.2、定义Model（与集合对应，可以操作集合）
const Blog = model('Blog', BlogSchema)

//1、定义特定集合的Model并向外暴露
//1.1、定义文档结构
const BlogTypeSchema = new Schema({
  name: { type: String, required: true },//标题
  introduction: { type: String, required: true },//介绍
  creatTime: { type: Number, default: today },//创建时间
})
//1.2、定义Model（与集合对应，可以操作集合）
const BlogType = model('BlogType', BlogTypeSchema)

module.exports = { Blog, BlogType }


