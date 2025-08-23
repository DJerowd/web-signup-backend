import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return next(new ErrorResponse("Este e-mail já está em uso.", 409));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      data: {
        message: "Usuário registrado com sucesso!",
        userId: user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorResponse('Credenciais inválidas.', 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse('Credenciais inválidas.', 401));
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.status(200).json({
      status: "success",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return next(new ErrorResponse("Usuário não encontrado.", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
