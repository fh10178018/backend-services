## 介绍
本项目是基于Express-MongoDB的一个个人简历后端应用，主要是用于提供相关接口，实现前端数据的动态数据。

## 安装依赖
`npm install`

## 启动
`npm start`

## 后端相关接口

### 1、登录接口

- **URL：** /user/login
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

|   参数   | 必选  |  类型  |   说明   |
| :------: | :---: | :----: | :------: |
| username | true  | string | 用户账号 |
| password | true  | string | 用户密码 |

- **返回字段：**

|     参数     |  必选  |                         说明                         |
| :----------: | :----: | :--------------------------------------------------: |
|    token     | string |                Jwt 生成的 token 字段                 |
| refreshToken | string | Jwt 生成的 token 字段,用于token过期时，自动更新token |

- **成功字段：**
```json
{
	"code": 1,
	"msg": "成功生成token",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmU0NTYxZDBmYjMyZTEyMWMzYjYyZjUiLCJ1c2VybmFtZSI6IjEyMDY3NTg4MjdAcXEuY29tIiwiaWF0IjoxNjA4Nzk5OTE5LCJleHAiOjE2MDg4ODYzMTl9.VOVQyiNpbaVcYMoLD_IWjrFVEXLeuOyyh1_m0RN1jqg",
		"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmU0NTYxZDBmYjMyZTEyMWMzYjYyZjUiLCJ1c2VybmFtZSI6IjEyMDY3NTg4MjdAcXEuY29tIiwiaWF0IjoxNjA4Nzk5OTE5LCJleHAiOjE2MDg4ODk5MTl9.KfQD2QwA79AQF9cbJdm_fa5GcqKv3CqK9xzxPGWzGVE"
	}
}
```
---

### 2、添加或修改管理员接口

- **URL：** /user/editAdminUser
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 是
- **请求参数：**

|   参数   | 必选  |  类型  |                          说明                           |
| :------: | :---: | :----: | :-----------------------------------------------------: |
| username | false | string | 用户账号,为空字符串时，添加管理员。否则为管理员用户修改 |
| password | true  | string |                        用户密码                         |
|   name   | true  | string |                        用户姓名                         |
| isAdmin  | true  | string |        该用户是否为管理员，0 代表不是，1 代表是         |

- **返回字段：**

| 参数  |  必选  |           说明           |
| :---: | :----: | :----------------------: |
|  msg  | string | 创建或修改是否成功的消息 |

---


### 3、密码修改接口

- **URL：** /user/editAdminUserPassword
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 是
- **请求参数：**

|   参数   | 必选  |  类型  |   说明   |
| :------: | :---: | :----: | :------: |
|   _id    | true  | string | 用户_id  |
| password | true  | string | 用户密码 |

- **返回字段：**

| 参数  |  必选  |        说明        |
| :---: | :----: | :----------------: |
|  msg  | string | 修改是否成功的消息 |

---

### 4、删除管理员接口

- **URL：**/user/deleteAdminUser
- **支持格式：**JSON
- **HTTP 请求方式：**POST
- **是否有管理员权限管理：**是
- **请求参数：**

| 参数  | 必选  |  类型  |       说明        |
| :---: | :---: | :----: | :---------------: |
| \_id  | true  | string | 用户唯一\_id 字段 |

- **返回字段：**

| 参数  |  必选  |        说明        |
| :---: | :----: | :----------------: |
|  msg  | string | 删除是否成功的消息 |

---

### 4、查询、分页或排序查找管理员数据

- **URL：** /user/getAdminUserList
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

| 参数  | 必选  |       类型       |     说明     |
| :---: | :---: | :--------------: | :----------: |
| page  | true  | number or string |     页码     |
| rows  | true  | number or string | 本页查询数量 |

- **返回字段：**

|  参数  |  必选  |       说明       |
| :----: | :----: | :--------------: |
| object | string | 返回查询结果信息 |

- **查询成功实例：**

```json
{
  "total": 1,
  "data": [
    {
      "creatTime": "2020-11-28T06:44:05.596Z",
      "loginTime": "2020-11-28T06:44:05.596Z",
      "isAdmin": "'1'",
      "_id": "5fc1f1bad88c920ca0b8b7a8",
      "username": "1206758827@qq.com",
      "name": "方晗"
    }
  ]
}
```

---

### 5、用于项目初始建立，创建初始数据，如果数据已有，不会触发

- **URL：** /initialization/setData
- **支持格式：** JSON
- **HTTP 请求方式：** GET
- **是否有管理员权限管理：** 否

- **返回字段：**

| 参数  |  必选  |             说明             |
| :---: | :----: | :--------------------------: |
| code  | number |         code数字信号         |
|  msg  | string | 创建newResumes是否成功的消息 |
| data  | string |      创建成功的历史记录      |

- **查询成功实例：**

```json
{
	"code": 1,
  "msg": "创建成功",
  "data": [ ... ]
}
```
---

### 6、删除某个简历

- **URL：** /resumes/deleteResumes
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 是
- **请求参数：**

| 参数  | 必选  |  类型  |    说明     |
| :---: | :---: | :----: | :---------: |
|  _id  | true  | string | 简历数据_id |

- **返回字段：**

| 参数  |  必选  |          说明          |
| :---: | :----: | :--------------------: |
| code  | number |      code数字信号      |
|  msg  | string | 删除成功是否成功的消息 |

- **查询成功实例：**

```json
{
	"code": 1,
	"msg": "删除成功"
}
```

---

### 7、获取简历编辑列表

- **URL：** /resumes/getResumesList
- **支持格式：** JSON
- **HTTP 请求方式：** GET
- **是否有管理员权限管理：** 否

- **返回字段：**

| 参数  |  必选  |        说明        |
| :---: | :----: | :----------------: |
| code  | number |    code数字信号    |
|  msg  | string | 查询是否成功的消息 |
| data  | array  |    查询列表数组    |

- **查询成功实例：**

```json
{
	"code": 1,
	"msg": "获取简历编辑列表",
	"data": [
		{
		"createTime": 1608787530717,
		"_id": "5fe42650db37444b5c113163",
		"birthday": 909050340000,
		"major": "自动化",
		"email": "1206758827@qq.com",
		"tel": "18817555016",
		"address": "暂无",
		"weixinImageUrl": "/upload/images/2020-12-20/weixin.png",
		"qqImageUrl": "/upload/images/2020-12-20/qq.png",
		"csdnUrl": "https://blog.csdn.net/qq_41411483",
		"saveName": "newResumes2020-12-24",
		"__v": 0
    },
      {
      "createTime": 1608787530717,
      "_id": "5fe42650db37444b5c113163",
      "birthday": 909050340000,
      "major": "自动化",
      "email": "1206758827@qq.com",
      "tel": "18817555016",
      "address": "暂无",
      "weixinImageUrl": "/upload/images/2020-12-20/weixin.png",
      "qqImageUrl": "/upload/images/2020-12-20/qq.png",
      "csdnUrl": "https://blog.csdn.net/qq_41411483",
      "saveName": "newResumes2020-12-24",
      "__v": 0
    }
	]
}
```

---

### 8、获取最新简历

- **URL：**/resumes/getNewResumes
- **支持格式：** JSON
- **HTTP 请求方式：** GET
- **是否有管理员权限管理：** 否

- **返回字段：**

| 参数  |  必选  |        说明        |
| :---: | :----: | :----------------: |
| code  | number |    code数字信号    |
|  msg  | string | 查询是否成功的消息 |

- **查询成功实例：**

```json
{
	"code": 1,
	"msg": "获取最新简历页",
	"data": {
		"createTime": 1608787530717,
		"_id": "5fe42650db37444b5c113163",
		"birthday": 909050340000,
		"major": "自动化",
		"email": "1206758827@qq.com",
		"tel": "18817555016",
		"address": "暂无",
		"weixinImageUrl": "/upload/images/2020-12-20/weixin.png",
		"qqImageUrl": "/upload/images/2020-12-20/qq.png",
		"csdnUrl": "https://blog.csdn.net/qq_41411483",
		"saveName": "newResumes2020-12-24",
		"__v": 0
	}
}
```

---

### 9、已上传图片删除接口

- **URL：**/imagefile/delete
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 是
- **请求参数：**

|   参数   | 必选  |  类型  |        说明         |
| :------: | :---: | :----: | :-----------------: |
| imageUrl | true  | string | 上传文件的 imageUrl |
- **返回字段：**

| 参数  |  必选  |        说明        |
| :---: | :----: | :----------------: |
| code  | string |    code数字信号    |
|  msg  | string | 删除是否成功的消息 |

- **查询成功实例：**

```json
{
	"code": 1,
	"msg": "删除成功"
}
```

---
### 10、上传单个图片接口

- **URL：**/imagefile/uploadSingleImage
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 是
- **请求参数：**

|    参数     | 必选  |  类型  |       说明       |
| :---------: | :---: | :----: | :--------------: |
|  imageFile  | true  |  file  |     上传文件     |
| description | true  | string | 介绍上传文件用途 |

- **返回字段：**
  
| 参数  |  必选  |        说明         |
| :---: | :----: | :-----------------: |
| code  | string |    code数字信号     |
|  msg  | string | 删除是否成功的消息  |
| data  | object | 内含创建的 imageUrl |

- **查询成功实例：**

```json
{
	"code": 1,
	"msg": "上传成功",
	"data": {
		"imageUrl": "/upload/images/2020-12-08/upload-1607404475891.jpg"
	}
}
```

---
### 11、下载图片接口

- **URL：**/imagefile/download
- **支持格式：** JSON
- **HTTP 请求方式：** GET
- **是否有管理员权限管理：** 是
- **请求参数：**

| Query 参数 | 必选  |  类型  |        说明         |
| :--------: | :---: | :----: | :-----------------: |
|  imageUrl  | true  | string | 上传文件的 imageUrl |
- **返回图像**

---
### 12、前端留下信息接口

- **URL：**/resumes/contact
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

|  参数   | 必选  |  类型  |        说明        |
| :-----: | :---: | :----: | :----------------: |
|  name   | true  | string | 上传信息的用户昵称 |
|  email  | true  | string | 上传信息的用户邮箱 |
| message | true  | string |    上传信息内容    |

- **访问成功后**
```json
{
	"code": 1,
	"msg": "发送成功"
}
```
- **相同IP访问三次后**
```json
{
	"code": 0,
	"msg": "当前IP已经上传超过３次"
}
```
---
### 13、获取前端信息列表接口

- **URL：**/resumes/getMessageList
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

|  参数   | 必选  |  类型   |                 说明                  |
| :-----: | :---: | :-----: | :-----------------------------------: |
|  page   | true  | number  |                 页数                  |
|  rows   | true  | number  |               一页行数                |
| isReady | false | Boolean | 不填为全部，填了根据isReady值查询列表 |


- **isReady不填任何，访问成功后**
```json
{
	"code": 1,
	"msg": "成功获取信息列表",
	"data": {
		"total": 3,
		"data": [
			{
				"email": "邮箱",
				"creatTime": 1608332672939,
				"isRead": false,
				"_id": "5fdd3583db3f161f28b92cc0",
				"name": "方先生",
				"message": "信息",
				"ip": "::1",
				"__v": 0
			},
			{
				"email": "邮箱",
				"creatTime": 1608332996930,
				"isRead": false,
				"_id": "5fdd36c7b6b2f75af04d86d1",
				"name": "方先生",
				"message": "信息",
				"ip": "::1",
				"__v": 0
			},
			{
				"email": "邮箱",
				"creatTime": 1608333120686,
				"isRead": false,
				"_id": "5fdd374542d9c2599cc12848",
				"name": "方先生",
				"message": "信息",
				"ip": "::1",
				"__v": 0
			}
		]
	}
}
```
- **isReady填true**
```json
{
	"code": 1,
	"msg": "成功获取信息列表",
	"data": {
		"total": 0,
		"data": []
	}
}
```
---
### 12、前端信息标记已读接口

- **URL：**/resumes/maskRead
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

| 参数  | 必选  |  类型  |  说明   |
| :---: | :---: | :----: | :-----: |
|  _id  | true  | string | 信息_id |


- **访问成功后**
```json
{
	"code": 1,
	"msg": "成功标记已读"
}
```
---
### 13、前端信息删除接口

- **URL：**/resumes/deleteMessage
- **支持格式：** JSON
- **HTTP 请求方式：** DELETE
- **是否有管理员权限管理：** 否
- **请求参数：**

| 参数  | 必选  |  类型  |  说明   |
| :---: | :---: | :----: | :-----: |
|  _id  | true  | string | 信息_id |


- **访问成功后**
```json
{
	"code": 1,
	"msg": "删除成功"
}
```
---
### 14、日志创建接口

- **URL：**/resumes/deleteMessage
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

|     参数     | 必选  |   类型   |                       说明                        |
| :----------: | :---: | :------: | :-----------------------------------------------: |
|     _id      | true  |  string  | 日志_id，为''空字符串时为创建新的日志，否则为编辑 |
| introduction | true  |  string  |                       介绍                        |
|   imageUrl   | true  |  string  |                      图像Url                      |
|   content    | true  |  string  |                日志内容为markdown                 |
|    types     | true  | string[] |               类型列表，可以为多个                |

- **创建访问成功后**
```json
{
	"code": 1,
	"msg": "创建成功"
}
```
- **修改访问成功后**
```json
{
	"code": 1,
	"msg": "日志修改成功"
}
```
---

### 15、获取日志列表接口

- **URL：**/resumes/getBlogList
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**

| 参数  | 必选  |  类型  |             说明              |
| :---: | :---: | :----: | :---------------------------: |
| page  | true  | number |           查询页数            |
| rows  | true  | number |         查询最大行数          |
| type  | true  | string | 查询类型,为空字符串时，为全部 |

- **访问成功后**
```json
{
	"code": 1,
	"msg": "成功获取日志列表",
	"data": {
		"total": 4,
    "data": [ ]// 日志列表，太多省略
  }
```
---
### 16、获取日志类型数组接口

- **URL：**/resumes/getBlogType
- **支持格式：** JSON
- **HTTP 请求方式：** GET
- **是否有管理员权限管理：** 否
- **请求参数：**
无

- **访问成功后**
```json
{
	"code": 1,
	"msg": "获取日志类别",
	"data": [
		"Vue",
		"React",
		"Typescript",
		"HTML/CSS",
		"设计"
	]
}
```
---

### 17、浏览量增加接口

- **URL：**/resumes/increaseTheBrowse
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**
| 参数  | 必选  |  类型  |  说明   |
| :---: | :---: | :----: | :-----: |
|  _id  | true  | string | 日志_id |


- **访问成功后**
```json
{
	"code": 1,
	"msg": "增加浏览量"
}
```
---
### 18、点赞日志接口

- **URL：**/resumes/giveALike
- **支持格式：** JSON
- **HTTP 请求方式：** POST
- **是否有管理员权限管理：** 否
- **请求参数：**
| 参数  | 必选  |  类型  |  说明   |
| :---: | :---: | :----: | :-----: |
|  _id  | true  | string | 日志_id |


- **访问成功后**
```json
{
	"code": 1,
	"msg": "点赞成功"
}
```
---
