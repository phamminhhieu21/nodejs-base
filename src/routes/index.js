import user from './user';
import auth from './auth';
import insert from './insert';
import book from './book';
import media from './media';
import { notFound } from '../middlewares/handleErrors';
const initRoutes = (app) => {
  // auth
  app.use('/api/v1/auth',auth );
  // user
  app.use('/api/v1/user', user);
  // book
  app.use('/api/v1/book', book);
  // media
  app.use('/api/v1/media', media);
  // insert data
  app.use('/api/v1/insert', insert);
  app.use(notFound);
};

module.exports = initRoutes;