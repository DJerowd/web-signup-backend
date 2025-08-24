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
      return next(new ErrorResponse("Credenciais inválidas.", 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse("Credenciais inválidas.", 401));
    }
    const accessToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(
      new ErrorResponse("Acesso negado. Nenhum refresh token fornecido.", 401)
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({
      where: { id: decoded.user.id, refreshToken: token },
    });
    if (!user) {
      return next(
        new ErrorResponse("Refresh token inválido ou revogado.", 403)
      );
    }
    const accessToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );
    res.status(200).json({
      status: "success",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return next(new ErrorResponse("Refresh token inválido ou expirado.", 403));
  }
};

export const logout = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.sendStatus(204);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ where: { id: decoded.user.id } });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({
      status: "success",
      data: { message: "Logout realizado com sucesso." },
    });
  } catch (error) {
    res.clearCookie("refreshToken");
    return next(
      new ErrorResponse("Erro ao fazer logout, token inválido.", 403)
    );
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
