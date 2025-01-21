const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const News = sequelize.define("news", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  theme: { type: DataTypes.STRING, allowNull: false },
  video_url: { type: DataTypes.TEXT, defaultValue: null },
});

const Image = sequelize.define("image", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Pdf = sequelize.define("pdf", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Audio = sequelize.define("audio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const OfferNews = sequelize.define("offer_news", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
});

const OfferFile = sequelize.define("offer_file", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
});

News.hasMany(Image, { as: "image", onDelete: "CASCADE", onUpdate: "CASCADE" });
Image.belongsTo(News);

News.hasMany(Pdf, { as: "pdf", onDelete: "CASCADE", onUpdate: "CASCADE" });
Pdf.belongsTo(News);

News.hasMany(Audio, { as: "audio", onDelete: "CASCADE", onUpdate: "CASCADE" });
Audio.belongsTo(News);

OfferNews.hasMany(OfferFile, {
  as: "offerFile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OfferFile.belongsTo(OfferNews);

module.exports = {
  User,
  News,
  Image,
  Pdf,
  Audio,
  OfferNews,
  OfferFile,
};
