const express = require('express');
const bodyParser = require('body-parser')
const mongo = require('./config/db');
const router = require('./routes/router');
const cors = require('cors')
const app = express();
var pathname = __dirname;

app.use(cors())
app.use(express.static(pathname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extend: true }))
mongo(app);
router(app);

module.exports = app;
