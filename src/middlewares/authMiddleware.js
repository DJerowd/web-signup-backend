import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/ErrorResponse.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return next(
      new ErrorResponse("Acesso negado. Nenhum token fornecido.", 401)
    );
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ErrorResponse("Token malformatado.", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Token inválido ou expirado.", 401));
  }
};

export default authMiddleware;
