const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Ocorreu um erro no servidor.";
  res.status(statusCode).json({
    status,
    message,
  });
};

export default errorMiddleware;
