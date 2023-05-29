import jwt from "jsonwebtoken";
import { badRequest, UnauthorizedError } from "./handleErrors";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader?.split(" ")[1];
  if (!access_token) return badRequest("Require authorization", res);
  jwt.verify(access_token, process.env.JWT_SECRET, (err, decoded_user) => {
    if (err) return UnauthorizedError("Invalid token", res);
    req.user = decoded_user; // add user to req object for next middleware to use it 
    next(); // call next middleware 
  });
};
export default verifyToken;