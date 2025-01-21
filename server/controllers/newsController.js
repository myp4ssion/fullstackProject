const { News, Image, Pdf, Audio } = require("../models/models");
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

const THEMES = ["theater", "music", "art", "literature", "movie", "scene"];

async function deleteFile(fileName) {
  try {
    await fs.unlink(path.resolve(__dirname, "..", "static", fileName));
    console.log("Файл удален успешно");
  } catch (e) {
    console.log(fileName);
    console.log(e.message);
  }
}

class NewsController {
  async create(req, res, next) {
    try {
      const { title, description, theme, video_url } = req.body;

      if (!title) {
        return next(ApiError.badRequest("Не указан заголовок"));
      }

      if (!description) {
        return next(ApiError.badRequest("Не указано описание"));
      }

      if (!theme || !THEMES.includes(theme)) {
        return next(ApiError.badRequest("Не указана тема"));
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return next(
          ApiError.badRequest("Хотя бы 1 файл должен быть прикреплен")
        );
      }

      const files = Array.isArray(req.files.files)
        ? req.files.files
        : [req.files.files];

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

      const news = await News.create({
        title,
        description,
        theme,
        video_url,
      });

      uuidFiles.forEach((file) => {
        if (
          REGEX_JPEG.test(file) ||
          REGEX_JPG.test(file) ||
          REGEX_PNG.test(file) ||
          REGEX_WEBP.test(file)
        ) {
          Image.create({
            name: file,
            newsId: news.id,
          });
        } else if (REGEX_MP3.test(file)) {
          Audio.create({
            name: file,
            newsId: news.id,
          });
        } else if (REGEX_PDF.test(file)) {
          Pdf.create({
            name: file,
            newsId: news.id,
          });
        }
      });

      return res.json(news);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getByThemeAndLimit(req, res, next) {
    try {
      let { theme, page } = req.query;
      const limit = 5;
      page = page || 1;
      let offset = page * limit - limit;
      let news;
      if (!theme || !THEMES.includes(theme)) {
        return next(ApiError.badRequest("Не указана тема"));
      }

      news = await News.findAndCountAll({
        distinct: true,
        order: [["createdAt", "DESC"]],
        where: { theme },
        limit,
        offset,
        include: [
          { model: Image, as: "image" },
          { model: Audio, as: "audio" },
          { model: Pdf, as: "pdf" },
        ],
      });
      return res.json(news);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id, title, description, theme, video_url } = req.body;

      if (!id) {
        return next(ApiError.badRequest("Не указан id"));
      }

      if (!title) {
        return next(ApiError.badRequest("Не указан заголовок"));
      }

      if (!description) {
        return next(ApiError.badRequest("Не указано описание"));
      }

      if (!theme || !THEMES.includes(theme)) {
        return next(ApiError.badRequest("Не указана тема"));
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return next(
          ApiError.badRequest("Хотя бы 1 файл должен быть прикреплен")
        );
      }

      const files = Array.isArray(req.files.files)
        ? req.files.files
        : [req.files.files];

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

      const oldNew = await News.findOne({
        where: { id },
        include: [
          { model: Image, as: "image" },
          { model: Audio, as: "audio" },
          { model: Pdf, as: "pdf" },
        ],
      });

      await Image.destroy({
        where: {
          newsId: id,
        },
      });

      await Audio.destroy({
        where: {
          newsId: id,
        },
      });

      await Pdf.destroy({
        where: {
          newsId: id,
        },
      });

      oldNew.image.forEach((file) => deleteFile(file.name));
      oldNew.pdf.forEach((file) => deleteFile(file.name));
      oldNew.audio.forEach((file) => deleteFile(file.name));

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

      const news = await News.update(
        {
          title,
          description,
          theme,
          video_url,
        },
        {
          where: {
            id,
          },
        }
      );

      uuidFiles.forEach((file) => {
        if (
          REGEX_JPEG.test(file) ||
          REGEX_JPG.test(file) ||
          REGEX_PNG.test(file) ||
          REGEX_WEBP.test(file)
        ) {
          Image.create({
            name: file,
            newsId: id,
          });
        } else if (REGEX_MP3.test(file)) {
          Audio.create({
            name: file,
            newsId: id,
          });
        } else if (REGEX_PDF.test(file)) {
          Pdf.create({
            name: file,
            newsId: id,
          });
        }
      });

      return res.json({ message: "Новость успешно обновлена" });
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

      const oneNew = await News.findOne({
        where: { id },
        include: [
          { model: Image, as: "image" },
          { model: Audio, as: "audio" },
          { model: Pdf, as: "pdf" },
        ],
      });

      if (!oneNew) {
        return next(ApiError.badRequest("Публикации с таким id не существует"));
      }

      await News.destroy({
        where: {
          id,
        },
      });

      oneNew.image.forEach((file) => deleteFile(file.name));
      oneNew.pdf.forEach((file) => deleteFile(file.name));
      oneNew.audio.forEach((file) => deleteFile(file.name));

      return res.json({ oneNew });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new NewsController();
