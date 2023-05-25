const userRoute = require('./user');

const initRoutes = (app) => {
  // common
  app.use('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to Hieu server',
    });
  });
  // user
  app.use('/api/v1/user', userRoute);
};

module.exports = initRoutes;