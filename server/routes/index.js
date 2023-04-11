const postRoutes = require('./posts');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/posts', postRoutes);
  app.use('/user', userRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;