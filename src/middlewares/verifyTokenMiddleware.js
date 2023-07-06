import jwt from "jsonwebtoken";
import { badRequest, UnauthorizedError } from "./handleErrorMiddleware";

const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader?.split(" ")[1];
  if (!access_token) return badRequest("Require authorization", res);
  jwt.verify(access_token, process.env.JWT_SECRET, (err, decoded_user) => {
    if (err){
      const isChecked = err instanceof jwt.TokenExpiredError;
      return isChecked ? UnauthorizedError("Token expired", res) : UnauthorizedError("Invalid token", res);
    } 
    req.user = decoded_user; // add user to req object for next middleware to use it 
    next(); // call next middleware 
  });
};
export default verifyTokenMiddleware;