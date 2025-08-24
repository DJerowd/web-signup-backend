import rateLimit from 'express-rate-limit';
import ErrorResponse from '../utils/ErrorResponse.js';

const message = "Muitas tentativas de login. Por favor, tente novamente após 15 minutos.";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ErrorResponse(message, 429));
  },
});

export default loginLimiter;