import ErrorResponse from "../utils/ErrorResponse.js";

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return next(
    new ErrorResponse(
      "Acesso negado. Requer privilégios de administrador.",
      403
    )
  );
};

export default adminMiddleware;
