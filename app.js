const express = require('express');
const bodyParser = require('body-parser')
const mongo = require('./config/db');
const router = require('./routes/router');
const app = express();
var pathname = __dirname;
// 跨域.  CROS配置 ---------- Start
const cors = require('cors');
app.use(cors({
  origin: ['http://121.4.109.9:3000'], // 所要允许跨域的ip
  methods: ['GET', 'POST', 'DELETE'],
  alloweHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(pathname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
mongo(app);
router(app);

module.exports = app;
