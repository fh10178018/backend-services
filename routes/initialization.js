const express = require('express');
const AdminUser = require('../model/AdminUser');
const { Resumes, Experience, Introduction, Skills } = require('../model/Resumes');
const { BlogType } = require('../model/Blog');
const router = require('./resumes');
var moment = require('moment');
var timepath = moment().format('YYYY-MM-DD');

const resumesData = {
  birthday: new Date('1998-10-22  17:59:00.0').getTime(),
  major: '自动化',
  email: '1206758827@qq.com',
  tel: '18817555016',
  address: '暂无',
  weixinImageUrl: '/upload/images/weixin.png',
  qqImageUrl: '/upload/images/qq.png',
  csdnUrl: 'https://blog.csdn.net/qq_41411483',
  saveName: 'newResumes' + timepath
}

const adminUserData = {
  username:'1206758827@qq.com',
  password: '123456',
  isAdmin: true,
  name: '方晗'
}

const blogTypeData = [
  {name:'React',introduction:'React 是一个用于构建用户界面的 JAVASCRIPT 库。'},
  {name:'Vue',introduction:'Vue 是一套构建用户界面的渐进式框架。'},
  {name:'TypeScript',introduction:' TypeScript 是 JavaScript 的一个超集,支持 ECMAScript 6 标准(ES6 教程)。'},
  {name:'HTML&CSS',introduction:'HTML-网页结构和内容，CSS-表现样式'},
  {name:'Design',introduction:'创意设计'}
]

const experienceData = [
  {title:'前端开发学习 (2020 - 至今)',content:'学习前端相关基础知识，并实践开发一些前端项目，也曾在上海健医科技公司有过一个月的前端开发实习，技术栈为 React、TypeScript、Ant Design、Styled、Components，主要内容就是通过给定的 UI 图和接口内容开发相应的页面功能。'},
  {title:'勤工助学创意工作室正经理 (2019 - 2020)',content:'主要负责撰写相关设计策划和人员安排，负责举办校名纪念品大赛和后续纪念品的生产。开发过基于 Django 的 MVC 模式下的创意工作室宣传 Web 应用。'},
  {title:'勤工助学创意工作室设计师 (2017 - 2019)',content:'主要负责产品宣传设计、PPT、海报设计和 LOGO 等设计，宣传视频制作，有着良好的审美观。也曾参加多个大创项目，做过基于Django的MVC模式下的Web应用，做过有关线上导航的微信小程序。'}
]

const skillsData = [
  {name:'Vue',type:'code',percent:70},
  {name:'React',type:'code',percent:75},
  {name:'HTML&CSS',type:'code',percent:75},
  {name:'JavaScript',type:'code',percent:80},
  {name:'PhotoShop',type:'design',percent:80},
  {name:'Illustrator',type:'design',percent:75},
  {name:'Affter Effects',type:'design',percent:65},
  {name:'Premier',type:'design',percent:70}
]

const IntroductionData = [
  {content:'本人是一名跨专业 “破浪者” ，这也是我个人简历页设计和开发的理念。'},
  {content:'而且擅长也比较广，所以希望今后能够学精。同时你可以在我的日志中看到我的部分作品。'}
]

const setResumes = () => new Promise((resolve, reject) => {
  new Resumes({ ...resumesData }).save((err) => {
    if (err) reject(err)
    else resolve()
  })
})

const setAdminUser = () => new Promise((resolve, reject) => {
  new AdminUser({ ...adminUserData }).save((err) => {
    if (err) reject(err)
    else resolve()
  })
})

const setBlogType = () => new Promise((resolve, reject) => {
  const types = new Array()
  blogTypeData.forEach(item => {
    types.push(new BlogType({ ...item }))
  })
  BlogType.insertMany(types,function(err){
    if (err) reject(err)
    else resolve()
  })
})

const setSkills = () => new Promise((resolve, reject) => {
  const skills = new Array()
  skillsData.forEach(item => {
    skills.push(new Skills({ ...item }))
  })
  Skills.insertMany(skills,function(err){
    if (err) reject(err)
    else resolve()
  })
})

const setIntroduction = () => new Promise((resolve, reject) => {
  const introductions = new Array()
  IntroductionData.forEach(item => {
    introductions.push(new Introduction({ ...item }))
  })
  Introduction.insertMany(introductions,function(err){
    if (err) reject(err)
    else resolve()
  })
})

const setExperience = () => new Promise((resolve, reject) => {
  const experiences = new Array()
  experienceData.forEach(item => {
    experiences.push(new Experience({ ...item }))
  })
  Experience.insertMany(experiences,function(err){
    if (err) reject(err)
    else resolve()
  })
})

// 创建用户和编辑用户
router.get('/setData', (req, res) => {
  const data = new Array()
   Resumes.find((err, doc) => {
    if (!err) {
      if (doc.length === 0) {
        setResumes().then(() => {
          data.push('初始简历创建成功')
        })
      }
    }
  })
   Introduction.find((err, doc) => {
    if (!err) {
      if (doc.length === 0) {
        setIntroduction().then(() => {
          data.push('初始个人介绍创建成功')
        })
      }
    }
  })
   Experience.find((err, doc) => {
    if (!err) {
      if (doc.length === 0) {
        setExperience().then(() => {
          data.push('初始个人经验内容创建成功')
        })
      }
    }
  })
   Skills.find((err, doc) => {
    if (!err) {
      if (doc.length === 0) {
        setSkills().then(() => {
          data.push('初始个人技巧数值创建成功')
        })
      }
    }
  })
   AdminUser.find((err, doc) => {
    if (!err) {
      if (doc.length === 0) {
        setAdminUser().then(() => {
          data.push(`初始管理员创建成功，账号：${adminUserData.username}密码：${adminUserData.password}`)
        })
      }
    }
  })
   BlogType.find((err, doc) => {
    if (!err) {
      if (doc.length === 0) {
        setBlogType().then(() => {
          data.push('初始类型列表创建成功')
        })
      }
    }
  })
  if(data.length === 0) {
    res.send({ code: 0, msg: '创建失败' })
  } else {
    res.send({ code: 1, msg: '创建成功',data:data })
  }
});

module.exports = router;
