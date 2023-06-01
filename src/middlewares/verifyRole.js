import { UnauthorizedError } from "./handleErrors";

export const isAdmin = (req, res, next) => {
  const { role_code } = req.user;
  if (role_code !== '1') return UnauthorizedError('Require role Admin', res);
  next();
}
export const isCreatorOrAdmin = (req, res, next) => {
  const { role_code } = req.user;
  if (role_code !== '1' && role_code !== '2') return UnauthorizedError('Require role Admin/Creator', res);
  next();
}