import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  let token = req.header("Authorization");
  const bearerPrefix = "Bearer ";
  let actualToken =
    token && token.startsWith(bearerPrefix)
      ? token.slice(bearerPrefix.length)
      : token;

  token = actualToken;

  if (!token) return res.status(401).send({ mesasage: "Access denied" });

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.body.user_id = decode.id;

    next();
  } catch (er) {
    console.log("token is invalid", er);
    return res.status(400).send({ message: "token is invalid" });
  }
};

export default auth;
