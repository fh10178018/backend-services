const express = require('express');
const { Resumes, Experience, Introduction, Skills } = require('../model/Resumes');
const Message = require('../model/Message');
const router = express.Router();
var moment = require('moment');
const today = new Date(Date.now()).getTime()
var timepath = moment().format('YYYY-MM-DD');
const { isTokenTimeout, isAdmin } = require('./users');

const getSortResumesList = () => new Promise((resolve, reject) => {
  Resumes.find((err, res) => {
    if (err) reject()
    else resolve(res)
  }).sort({ createTime: -1 })
})

const deleteResumes = (_id) => new Promise((resolve, reject) => {
  if (_id) {
    Resumes.remove({ _id }, (err, doc) => {
      if (!err) {
        if (doc.n === 1) {
          resolve(res)
        } else {
          reject()
        }
      } else {
        reject()
      }
    })
  } else {
    Resumes.find()
      .sort({ _id: 1 })
      .limit(1).exec((err, res) => {
        if (!err) {
          console.log(res)
          Resumes.remove({ _id: res[0]._id }, (err, doc) => {
            if (!err) {
              resolve(res)
            } else {
              reject()
            }
          })
        } else {
          reject()
        }
      })
  }
})

router.get('/getResumesList', async (req, res) => {
  await getSortResumesList()
    .then((data) => res.status(201).send({ code: 1, msg: '获取简历编辑列表', data }))
    .catch(() => res.status(422).send({ code: 0, msg: '获取简历编辑列表失败' }))
});

router.get('/getNewResumes', async (req, res) => {
  await getSortResumesList()
    .then((data) => res.status(201).send({ code: 1, msg: '获取最新简历页', data: data[0] }))
    .catch(() => res.status(422).send({ code: 0, msg: '获取最新简历页失败' }))
});

router.get('/getCodeSkills', async (req, res) => {
  await Skills.find({ type: 'code' }, (err, doc) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '获取编程能力列表', data: doc })
    } else {
      res.status(422).send({ code: 0, msg: '获取编程能力列表失败' })
    }
  })
});

router.get('/getDesignSkills', async (req, res) => {
  await Skills.find({ type: 'design' }, (err, doc) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '获取设计能力列表', data: doc })
    } else {
      res.status(422).send({ code: 0, msg: '获取设计能力列表失败' })
    }
  })
});

router.post('/editSkills', isTokenTimeout);
router.post('/editSkills', isAdmin);
router.post('/editSkills', async (req, res) => {
  const { _id } = req.body
  if (_id === '') {
    delete (req.body['_id'])
    await new Skills(req.body).save((err, newVal) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '创建成功' })
      } else {
        res.status(422).send({ code: 0, msg: '创建失败' })
      }
    });
  } else {
    delete (req.body['_id'])
    await Skills.findByIdAndUpdate(_id, { ...req.body, editTime: today }, (err, newVal) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '技能修改成功' })
      } else {
        res.status(422).send({ code: 0, msg: '技能修改失败' })
      }
    })
  }
});

router.delete('/deleteSkills', isTokenTimeout);
router.delete('/deleteSkills', isAdmin);
router.delete('/deleteSkills', async (req, res) => {
  const { _id } = req.query
  Skills.remove({ _id }, (err, doc) => {
    if (!err) {
      if (doc.n === 1) {
        res.status(201).send({ code: 1, msg: '删除成功' })
      } else {
        res.status(422).send({ code: 0, msg: '删除错误' })
      }
    } else {
      res.status(422).send({ code: 0, msg: '删除错误' })
    }
  })
});


router.get('/getIntroduction', async (req, res) => {
  await Introduction.find().exec((err, doc) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '获取介绍列表', data: doc })
    } else {
      res.status(422).send({ code: 0, msg: '获取介绍列表失败' })
    }
  })
});

router.post('/editIntroduction', isTokenTimeout);
router.post('/editIntroduction', isAdmin);
router.post('/editIntroduction', async (req, res) => {
  const { _id } = req.body
  if (_id === '') {
    delete (req.body['_id'])
    await new Introduction(req.body).save((err, newVal) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '创建成功' })
      } else {
        res.status(422).send({ code: 0, msg: '创建失败' })
      }
    });
  } else {
    delete (req.body['_id'])
    await Introduction.findByIdAndUpdate(_id, { ...req.body, editTime: today }, (err, newVal) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '介绍内容修改成功' })
      } else {
        res.status(422).send({ code: 0, msg: '介绍内容修改失败' })
      }
    })
  }
});

router.delete('/deleteIntroduction', isTokenTimeout);
router.delete('/deleteIntroduction', isAdmin);
router.delete('/deleteIntroduction', async (req, res) => {
  const { _id } = req.query
  Introduction.remove({ _id }, (err, doc) => {
    if (!err) {
      if (doc.n === 1) {
        res.status(201).send({ code: 1, msg: '删除成功' })
      } else {
        res.status(422).send({ code: 0, msg: '删除错误' })
      }
    } else {
      res.status(422).send({ code: 0, msg: '删除错误' })
    }
  })
});


router.get('/getExperience', async (req, res) => {
  await Experience.find().exec((err, doc) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '获取经验列表', data: doc })
    } else {
      res.status(422).send({ code: 0, msg: '获取经验列表失败' })
    }
  })
});

router.post('/editExperience', isTokenTimeout);
router.post('/editExperience', isAdmin);
router.post('/editExperience', async (req, res) => {
  const { _id } = req.body
  if (_id === '') {
    delete (req.body['_id'])
    await new Experience(req.body).save((err, newVal) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '创建成功' })
      } else {
        res.status(422).send({ code: 0, msg: '创建失败' })
      }
    });
  } else {
    delete (req.body['_id'])
    await Experience.findByIdAndUpdate(_id, { ...req.body, editTime: today }, (err, newVal) => {
      if (!err) {
        res.status(201).send({ code: 1, msg: '经验内容修改成功' })
      } else {
        res.status(422).send({ code: 0, msg: '经验内容修改失败' })
      }
    })
  }
});

router.delete('/deleteExperience', isTokenTimeout);
router.delete('/deleteExperience', isAdmin);
router.delete('/deleteExperience', async (req, res) => {
  const { _id } = req.query
  Experience.remove({ _id }, (err, doc) => {
    if (!err) {
      if (doc.n === 1) {
        res.status(201).send({ code: 1, msg: '删除成功' })
      } else {
        res.status(422).send({ code: 0, msg: '删除错误' })
      }
    } else {
      res.status(422).send({ code: 0, msg: '删除错误' })
    }
  })
});

router.post('/saveResumes', isTokenTimeout);
router.post('/saveResumes', isAdmin);
router.post('/saveResumes', async (req, res) => {
  const {
    email,
    tel,
    address,
    weixinImageUrl,
    qqImageUrl,
    csdnUrl,
    birthday,
    major,
    saveName
  } = req.body
  new Resumes({
    email,
    tel,
    address,
    weixinImageUrl,
    qqImageUrl,
    csdnUrl,
    birthday,
    major,
    saveName: saveName ? saveName : 'newResumes' + timepath
  }).save((err) => {
    if (!err) res.status(201).send({ code: 1, msg: ' 创建成功' })
    else res.status(422).send({ code: 1, msg: '创建失败' })
  });
})

router.get('/createInitialResumes', isTokenTimeout);
router.get('/createInitialResumes', isAdmin);
router.get('/createInitialResumes', async (req, res) => {
  const newResumes = {
    birthday: new Date('1998-10-22  17:59:00.0').getTime(),
    major: '自动化',
    email: '1206758827@qq.com',
    tel: '18817555016',
    address: '暂无',
    weixinImageUrl: '/upload/images/2020-12-20/weixin.png',
    qqImageUrl: '/upload/images/2020-12-20/qq.png',
    csdnUrl: 'https://blog.csdn.net/qq_41411483',
    saveName: 'newResumes' + timepath
  }
  await Resumes.find((err, doc) => {
    if (!err) {
      if (doc.length > 5) {
        deleteResumes().then(() => {
          new Resumes({ ...newResumes }).save((err) => {
            if (!err) res.status(201).send({ code: 1, msg: '创建初始简历成功' })
            else res.status(422).send({ code: 1, msg: '创建失败' })
          })
        }).catch(() => {
          res.status(422).send({ code: 1, msg: '创建失败' })
        })
      } else {
        new Resumes({ ...newResumes }).save((err) => {
          if (!err) res.status(201).send({ code: 1, msg: '创建初始简历成功' })
          else res.status(422).send({ code: 1, msg: '创建失败' })
        })
      }
    } else {
      res.status(422).send({ code: 1, msg: '创建失败' })
    }
  })

});

router.delete('/deleteResumes', isTokenTimeout);
router.delete('/deleteResumes', isAdmin);
router.delete('/deleteResumes', async (req, res) => {
  const { _id } = req.body
  deleteResumes(_id).then(() => {
    res.status(201).send({ code: 1, msg: '删除成功' })
  }).catch(() => {
    res.status(422).send({ code: 0, msg: '删除错误' })
  })
});


router.post('/contact', async (req, res) => {
  const ip = getReqRemoteIp(req)
  Message.find({ ip, isRead: false }, (err, user) => {
    if (user.length > 2) {
      res.status(422).send({ code: 0, msg: '当前IP已经上传超过３次' })
    } else {
      new Message({ ...req.body, ip }).save((err, newUser) => {
        if (err) {
          console.log(err)
          res.status(422).send({ code: 0, msg: '发送失败' })
        } else {
          res.status(201).send({ code: 1, msg: '发送成功' })
        }
      });
    }
  })
});
// 获得上传者的IP地址
function getReqRemoteIp (req) { return (req.headers['x-forwarded-for'] || '').split(',')[0] || req.ip; };

router.post('/getMessageList', async (req, res) => {
  const page = req.body.page;
  const rows = req.body.rows;
  const isReady = req.body.isReady;
  if (isReady !== undefined && isReady !== '') {
    Message.find({ isReady }, (err, list) => {
      if (!err) {
        res.send({ code: 1, msg: '成功获取信息列表', data: { total: list.length, data: list } });
      } else {
        res.status(422).send({ code: 0, msg: '查询错误' })
      }
    }).skip((page - 1) * rows).limit(rows * 1)
  } else {
    Message.find({}, (err, list) => {
      if (!err) {
        res.send({ code: 1, msg: '成功获取信息列表', data: { total: list.length, data: list } });
      } else {
        res.status(422).send({ code: 0, msg: '查询错误' })
      }
    }).skip((page - 1) * rows).limit(rows * 1)
  }
});
router.get('/getMessage', async (req, res) => {
  const { _id } = req.query;
  await Message.findById(_id).exec((err, val) => {
    if (!err) {
      res.send({ code: 1, msg: '成功详细信息', data: val });
    } else {
      res.status(422).send({ code: 0, msg: '查询错误' })
    }
  })
});

router.post('/maskRead', async (req, res) => {
  const { _id } = req.body
  await Message.findByIdAndUpdate(_id, { isRead: true }, (err, oldV) => {
    if (!err) {
      res.status(201).send({ code: 1, msg: '成功标记已读' })
    } else {
      res.status(422).send({ code: 0, msg: '标记失败' })
    }
  })
})

router.delete('/deleteMessage', isTokenTimeout);
router.delete('/deleteMessage', isAdmin);
router.delete('/deleteMessage', async (req, res) => {
  const { _id } = req.query
  Message.remove({ _id }, (err, doc) => {
    if (!err) {
      if (doc.n === 1) {
        res.status(201).send({ code: 1, msg: '删除成功' })
      } else {
        res.status(422).send({ code: 0, msg: '尚未找到该信息' })
      }
    } else {
      res.status(422).send({ code: 0, msg: '删除错误' })
    }
  })
});



module.exports = router;