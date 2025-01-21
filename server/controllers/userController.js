const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");

const generateJwt = (id, login, role) => {
  return jwt.sign({ id, login, role }, process.env.KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async reg(req, res, next) {
    const { login, password, role } = req.body;

    if (!login || !password) {
      return next(ApiError.badRequest("Некорректный ввод"));
    }
    const candidate = await User.findOne({ where: { login } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с такми логином уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ login, password: hashPassword, role });
    const token = generateJwt(user.id, user.login, user.role);

    return res.json({ token });
  }

  async login(req, res, next) {
    const { login, password } = req.body;

    if (!login || !password) {
      return next(ApiError.badRequest("Некорректный ввод"));
    }
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return next(ApiError.badRequest("Неверный логин или пароль"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest("Неверный логин или пароль"));
    }
    const token = generateJwt(user.id, user.login, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.login, req.user.role);
    return res.json({ token });
  }
}

module.exports = new UserController();
