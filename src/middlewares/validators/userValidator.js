import { body } from "express-validator";

export const updateUserValidationRules = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("O campo nome não pode ser vazio."),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Por favor, forneça um e-mail válido."),
  ];
};
