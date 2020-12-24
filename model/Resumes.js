const mongoose = require('mongoose')
const { Schema, model } = mongoose
const today = new Date(Date.now()).getTime()

const ResumesSchema = new Schema({
  saveName: { type: String, required: true },// 数据类型，new 或 old
  createTime: { type: Number, required: true, default: today }, // 编辑日期
  email: { type: String, required: true },// 邮箱
  tel: { type: String, required: true },// 电话
  address: { type: String, required: true },// 地址
  weixinImageUrl: { type: String, required: false }, // url地址
  qqImageUrl: { type: String, required: true },// 图片地址
  csdnUrl: { type: String, required: true },// csdn地址
  birthday: { type: Number, required: true },// 年龄
  major: { type: String, required: true },// 专业
})
const Resumes = model('Resume', ResumesSchema)

const SkillsSchema = new Schema({
  name: { type: String, required: true },// 名称
  percent: { type: Number, required: true }, // 百分比
  type: { type: String, default: 'design' },  // design/code
  createTime: { type: Number, default: today }, // 创建日期
  editTime: { type: Number, default: today } // 编辑日期
})
const Skills = model('Skills', SkillsSchema)

const IntroductionSchema = new Schema({
  content: { type: String, required: true },// 名称
  createTime: { type: Number, default: today }, // 创建日期
  editTime: { type: Number, default: today } // 编辑日期
})
const Introduction = model('Introduction', IntroductionSchema)

const ExperienceSchema = new Schema({
  title: { type: String, required: true },// 名称
  content: { type: String, required: true }, // 内容
  createTime: { type: Number, default: today }, // 创建日期
  editTime: { type: Number, default: today } // 编辑日期
})
const Experience = model('Experience', ExperienceSchema)

module.exports = { Resumes, Experience, Introduction, Skills }