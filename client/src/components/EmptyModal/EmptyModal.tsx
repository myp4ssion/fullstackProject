import { ChangeEvent, FC, useRef, useState } from "react";
import classes from "./EmptyModal.module.scss";
import fonts from "@/scss/fonts.module.scss";

import CrossSvg from "@/assets/cross.svg";
import ClipSvg from "@/assets/clip.svg";

import FileComponent from "../FileComponent/FileComponent";

import { MainPaths } from "@/types/types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { postNews, updateNews } from "@/http/newsAPI";

const regexRutube =
  /^https?:\/\/(www\.)?rutube\.ru\/play\/embed\/[a-f0-9]+\/?$/;
const regexVk = /^https?:\/\/(www\.)?vkvideo\.ru\/video_ext\.php\?(.*)$/;
const regexImage = /\.(png|jpg|jpeg)$/;

const enterUrlInfo = `Инструкция по вставке ссылки

Rutube
На сайте под видео кнопка 'Поделиться' => 'Код вставки плеера'.
Скопируйте часть кода без кавычек, который находится в поле src.
Пример ссылки: https://rutube.ru/play/embed/528b42b470dd25245e0fffbcc4970b52/

VK Видео
На сайте под видео кнопка 'Поделиться'.
Скопируйте часть кода из верхнего блока без кавычек, который находится в поле src.
Из полученной ссылки можете удалить '&autoplay=1', чтобы видео не загружалось автоматически.
Пример полученной ссылки: 
https://vkvideo.ru/video_ext.php?oid=-90019663&id=456248469&hd=2

После публикации не забудьте проверить работоспособность`;

const EmptyModal: FC<{
  setShowModal: (value: boolean) => void;
}> = ({ setShowModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [error, setError] = useState("");
  const [userFiles, setUserFiles] = useState([]);
  const [theme, setTheme] = useState(MainPaths.Theater);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const allImages = userFiles.filter((file) => regexImage.test(file.name));
  const inputFileRef = useRef(null);

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleVideoUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleClickCross = () => {
    setShowModal(false);
  };

  function handleFilePickerRef() {
    inputFileRef.current.click();
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    setTheme(e.target.value);
  };

  const handleReject = () => {
    setShowConfirmSubmit(false);
  };

  const handleAccept = () => {
    setShowConfirmSubmit(false);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("theme", theme);
    userFiles.forEach((file) => {
      formData.append("files", file);
    });
    if (videoUrl) {
      formData.append("video_url", videoUrl);
    }
    postNews(formData)
      .then(() => setShowModal(false))
      .catch((error) => setError(error.message));
  };

  const handleSubmit = () => {
    if (!title) {
      setError("Не указана тема");
      return;
    }

    if (!description) {
      setError("Не указано описание");
      return;
    }

    if (userFiles.length === 0) {
      setError("Хотя бы 1 файл должен быть прикреплен");
      return;
    }

    if (!videoUrl && allImages.length === 0) {
      setError("Ссылка на видео или изображение должны присутствовать");
      return;
    }

    if (videoUrl && !regexRutube.test(videoUrl) && !regexVk.test(videoUrl)) {
      setError("Ссылка на видео не подходит по формату");
      return;
    }
    setShowConfirmSubmit(true);
  };

  function onAddFile(e: ChangeEvent<HTMLInputElement>) {
    const regex = /\.(png|jpg|jpeg|pdf|mp3)$/;
    const selectedFiles = e.target.files;
    const newFiles = [...Array.from(selectedFiles)];
    for (let file of newFiles) {
      if (userFiles.find((oldFile) => oldFile.name === file.name)) {
        setError(`Файл с именем ${file.name} уже добавлен`);
        return;
      }
      if (!regex.test(file.name)) {
        setError(`${file.name}: неподдерживаемый тип`);
        return;
      }
    }
    setError("");
    setUserFiles((prev) => [...prev, ...newFiles]);
    inputFileRef.current.value = "";
  }

  return (
    <div className={classes.modalOfferNewsContainer}>
      {showConfirmSubmit && (
        <ConfirmModal
          message="Опубликовать?"
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      )}
      <div className={classes.modalInfoContainer}>
        <div className={classes.topContainer}>
          <span className={`${classes.modalTitle} ${fonts.u500}`}>
            Новая публикация
          </span>
          <div className={classes.topRight}>
            <CrossSvg onClick={handleClickCross} className={classes.cross} />
          </div>
        </div>
        <div className={classes.midleContainer}>
          <div className={classes.leftContainer}>
            <span className={`${classes.defaultText} ${fonts.g300}`}>Тема</span>
            <input
              className={`${classes.inputModal} ${fonts.u500}`}
              type="text"
              value={title}
              onChange={handleTitle}
            />
            <span className={`${classes.defaultText} ${fonts.g300}`}>
              Описание
            </span>
            <textarea
              value={description}
              onChange={handleDescription}
              className={`${classes.textareaModal} ${fonts.g300}`}
            />
            <span className={`${classes.defaultText} ${fonts.g300}`}>
              Категория
            </span>
            <select
              value={theme}
              onChange={handleSelect}
              className={`${classes.select} ${fonts.u500}`}
              name="select"
            >
              <option value={MainPaths.Theater}>Театр</option>
              <option value={MainPaths.Music}>Музыка</option>
              <option value={MainPaths.Scene}>Сцена</option>
              <option value={MainPaths.Movie}>Кино</option>
              <option value={MainPaths.Leterature}>Литература</option>
              <option value={MainPaths.Art}>ИЗО</option>
            </select>
            <div className={classes.infoContainer}>
              <span className={`${classes.defaultText} ${fonts.g300}`}>
                Ссылка на видео (Rutube, VK){" "}
              </span>
              <div className={`${classes.infoIcon} ${fonts.u500}`}>
                (!)
                <div className={`${classes.infoBlock} ${fonts.g300}`}>
                  {enterUrlInfo}
                </div>
              </div>
            </div>
            <input
              value={videoUrl}
              onChange={handleVideoUrl}
              className={`${classes.inputModal} ${fonts.g300}`}
              type="text"
            />
          </div>
          <div className={classes.rightContainer}>
            <div className={classes.filesContainer}>
              <input
                className={classes.inputHidden}
                ref={inputFileRef}
                type="file"
                multiple
                onChange={onAddFile}
                accept=".png, .jpg, .jpeg, .pdf, .mp3"
              />
              <div
                className={`${classes.filePickerBtn} ${fonts.g300}`}
                onClick={handleFilePickerRef}
              >
                Прикрепить файлы
                <ClipSvg className={classes.clip} />
              </div>
              <div className={classes.fileContainer}>
                {userFiles ? (
                  userFiles?.map((file) => (
                    <FileComponent
                      file={file}
                      setFiles={setUserFiles}
                      key={file.name}
                    />
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className={classes.bottomContent}>
              <span className={`${classes.error} ${fonts.g300}`}>{error}</span>
              <div className={classes.buttonsContainer}>
                <button
                  onClick={handleSubmit}
                  className={`${classes.sendButton} ${fonts.u500}`}
                >
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyModal;
