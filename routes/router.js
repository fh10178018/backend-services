const { usersRouter } = require('./users');
const resumesRouter = require('./resumes');
const { fileRouter } = require('./file');
const blogRouter = require('./blog');
module.exports = app => {
  app.use('/user', usersRouter)
  app.use('/resumes', resumesRouter)
  app.use('/imagefile', fileRouter)
  app.use('/blog', blogRouter)
};

