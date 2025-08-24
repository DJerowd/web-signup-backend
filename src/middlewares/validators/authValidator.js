import { body, validationResult } from "express-validator";
import ErrorResponse from "../../utils/ErrorResponse.js";

export const registerValidationRules = () => {
  return [
    body("name").trim().notEmpty().withMessage("O campo nome é obrigatório."),
    body("email").isEmail().withMessage("Por favor, forneça um e-mail válido."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("A senha deve ter no mínimo 8 caracteres."),
  ];
};

export const loginValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Por favor, forneça um e-mail válido."),
    body("password").notEmpty().withMessage("O campo senha é obrigatório."),
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = {};
  errors.array().forEach((err) => {
    if (!extractedErrors[err.path]) {
      extractedErrors[err.path] = err.msg;
    }
  });
  return next(
    new ErrorResponse("Dados fornecidos são inválidos.", 422, extractedErrors)
  );
};

export const forgotPasswordValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Por favor, forneça um e-mail válido."),
  ];
};

export const resetPasswordValidationRules = () => {
  return [
    body("password")
      .isLength({ min: 8 })
      .withMessage("A nova senha deve ter no mínimo 8 caracteres."),
  ];
};
