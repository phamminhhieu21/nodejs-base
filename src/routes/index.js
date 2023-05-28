import user from './user';
import auth from './auth';

const initRoutes = (app) => {
  // auth
  app.use('/api/v1/auth',auth );
  // user
  // app.use('/api/v1/user', user);

};

module.exports = initRoutes;