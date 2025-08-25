import { Op } from "sequelize";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [["name", "ASC"]],
    });
    res.status(200).json({
      status: "success",
      data: {
        users: rows,
        pagination: {
          totalUsers: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page, 10),
          limit: parseInt(limit, 10),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });
    if (!user) {
      return next(new ErrorResponse("Utilizador não encontrado.", 404));
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

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const loggedInUserId = req.user.id;
  const loggedInUserRole = req.user.role;
  try {
    const userToUpdate = await User.findByPk(id);
    if (!userToUpdate) {
      return next(new ErrorResponse("Usuário não encontrado.", 404));
    }
    if (userToUpdate.id !== loggedInUserId && loggedInUserRole !== "admin") {
      return next(
        new ErrorResponse(
          "Você não tem permissão para executar esta ação.",
          403
        )
      );
    }
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    await userToUpdate.save();
    const userResponse = userToUpdate.toJSON();
    delete userResponse.password;
    res.status(200).json({
      status: "success",
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id;
  const loggedInUserRole = req.user.role;
  try {
    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {
      return next(new ErrorResponse("Usuário não encontrado.", 404));
    }
    if (userToDelete.id !== loggedInUserId && loggedInUserRole !== "admin") {
      return next(
        new ErrorResponse(
          "Você não tem permissão para executar esta ação.",
          403
        )
      );
    }
    await userToDelete.destroy();
    res.status(200).json({
      status: "success",
      data: {
        message: "Usuário deletado com sucesso.",
      },
    });
  } catch (error) {
    next(error);
  }
};
