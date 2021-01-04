const { usersRouter } = require('./users');
const resumesRouter = require('./resumes');
const { fileRouter } = require('./file');
const blogRouter = require('./blog');
const initializationRouter = require('./initialization');
module.exports = app => {
  app.use('/user', usersRouter)
  app.use('/resumes', resumesRouter)
  app.use('/imagefile', fileRouter)
  app.use('/blog', blogRouter)
  app.use('/initialization', initializationRouter)
};

