const { OfferNews, OfferFile } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const { where } = require("sequelize");
const fs = require("fs").promises;

const REGEX_JPG = /\.jpg$/i;
const REGEX_JPEG = /\.jpeg$/i;
const REGEX_PNG = /\.png$/i;
const REGEX_WEBP = /\.webp$/i;
const REGEX_PDF = /\.pdf$/i;
const REGEX_MP3 = /\.mp3$/i;

async function deleteFile(fileName) {
  try {
    await fs.unlink(path.resolve(__dirname, "..", "static", fileName));
    console.log("Файл удален успешно");
  } catch (e) {
    console.log(fileName);
    console.log(e.message);
  }
}

class OfferNewsController {
  async create(req, res, next) {
    try {
      const { title, description, email } = req.body;

      if (!title) {
        return next(ApiError.badRequest("Не указан заголовок"));
      }

      if (!description) {
        return next(ApiError.badRequest("Не указано описание"));
      }

      if (!email) {
        return next(ApiError.badRequest("Не указан email"));
      }

      let files = [];

      if (req.files) {
        files = Array.isArray(req.files.files)
          ? req.files.files
          : [req.files.files];

        if (files.length > 5) {
          return next(ApiError.badRequest("Нельзя прикрепить больше 5 файлов"));
        }
      }

      let errorFileName = null;

      files.forEach((file) => {
        if (
          !REGEX_JPG.test(file.name) &&
          !REGEX_JPEG.test(file.name) &&
          !REGEX_PNG.test(file.name) &&
          !REGEX_WEBP.test(file.name) &&
          !REGEX_MP3.test(file.name) &&
          !REGEX_PDF.test(file.name)
        ) {
          errorFileName = file.name;
        }
      });

      if (errorFileName) {
        return next(
          ApiError.badRequest("Неверный формат файла: " + errorFileName)
        );
      }

      const uuidFiles = [];

      files.forEach((file) => {
        if (REGEX_JPEG.test(file.name)) {
          let uuidFileName = uuid.v4() + ".jpeg";
          uuidFiles.push(uuidFileName);
          file.mv(path.resolve(__dirname, "..", "static", uuidFileName));
        } else if (REGEX_JPG.test(file.name)) {
          let uuidFileName = uuid.v4() + ".jpg";
          uuidFiles.push(uuidFileName);
          file.mv(path.resolve(__dirname, "..", "static", uuidFileName));
        } else if (REGEX_PNG.test(file.name)) {
          let uuidFileName = uuid.v4() + ".png";
          uuidFiles.push(uuidFileName);
          file.mv(path.resolve(__dirname, "..", "static", uuidFileName));
        } else if (REGEX_WEBP.test(file.name)) {
          let uuidFileName = uuid.v4() + ".webp";
          uuidFiles.push(uuidFileName);
          file.mv(path.resolve(__dirname, "..", "static", uuidFileName));
        } else if (REGEX_MP3.test(file.name)) {
          let uuidFileName = uuid.v4() + ".mp3";
          uuidFiles.push(uuidFileName);
          file.mv(path.resolve(__dirname, "..", "static", uuidFileName));
        } else if (REGEX_PDF.test(file.name)) {
          let uuidFileName = uuid.v4() + ".pdf";
          uuidFiles.push(uuidFileName);
          file.mv(path.resolve(__dirname, "..", "static", uuidFileName));
        }
      });

      const offerNews = await OfferNews.create({
        title,
        description,
        email,
      });

      uuidFiles.forEach((file) => {
        if (
          REGEX_JPEG.test(file) ||
          REGEX_JPG.test(file) ||
          REGEX_PNG.test(file) ||
          REGEX_WEBP.test(file)
        ) {
          OfferFile.create({
            name: file,
            type: "image",
            offerNewId: offerNews.id,
          });
        } else if (REGEX_MP3.test(file)) {
          OfferFile.create({
            name: file,
            type: "audio",
            offerNewId: offerNews.id,
          });
        } else if (REGEX_PDF.test(file)) {
          OfferFile.create({
            name: file,
            type: "pdf",
            offerNewId: offerNews.id,
          });
        }
      });
      return res.json(offerNews);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { page } = req.query;
      const limit = 5;
      page = page || 1;
      let offset = page * limit - limit;
      let offerNews;

      offerNews = await OfferNews.findAndCountAll({
        distinct: true,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        include: [{ model: OfferFile, as: "offerFile" }],
      });
      return res.json(offerNews);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      let { id } = req.query;

      if (!id) {
        return next(ApiError.badRequest("Не указан id"));
      }

      const oneOfferNew = await OfferNews.findOne({
        where: { id },
        include: [{ model: OfferFile, as: "offerFile" }],
      });

      if (!oneOfferNew) {
        return next(
          ApiError.badRequest(
            "Предложенной публикации с таким id не существует"
          )
        );
      }

      await OfferNews.destroy({
        where: {
          id,
        },
      });

      oneOfferNew.offerFile.forEach((file) => deleteFile(file.name));

      return res.json({ oneOfferNew });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OfferNewsController();
