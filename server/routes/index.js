const postRoutes = require('./posts');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/api/posts', postRoutes);
  app.use('/api/user', userRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;