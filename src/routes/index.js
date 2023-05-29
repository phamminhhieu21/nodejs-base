import user from './user';
import auth from './auth';
import { notFound } from '../middlewares/handleErrors';
const initRoutes = (app) => {
  // auth
  app.use('/api/v1/auth',auth );
  // user
  app.use('/api/v1/user', user);
  app.use(notFound)
};

module.exports = initRoutes;