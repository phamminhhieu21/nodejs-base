import user from './userRoute';
import auth from './authRoute';
import insert from './insertRoute';
import book from './bookRoute';
import media from './mediaRoute';
import * as controllers from '../controllers'
import { notFound } from '../middlewares/handleErrorMiddleware';
const initRoutes = (app) => {
  // auth
  app.use('/api/v1/auth',auth );
  app.use('/api/v1/auth/register/confirm-mail/:token', controllers.verifyRegisterMailController);
  // app.use('/api/v1/auth/refresh-token/:token', controllers.refreshTokenController);

  // user
  app.use('/api/v1/user/update-profile', controllers.updateProfileUser);
  app.use('/api/v1/user/:idUser', controllers.getCurrent);

  // book
  app.use('/api/v1/book', book);

  // media
  app.use('/api/v1/media', media);

  // insert data
  app.use('/api/v1/insert', insert);
  app.use(notFound);
};

module.exports = initRoutes;