const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Ocorreu um erro no servidor.";
  const response = {
    status,
    message,
  };
  if (err.errors) {
    response.errors = err.errors;
  }
  res.status(statusCode).json(response);
};

export default errorMiddleware;
