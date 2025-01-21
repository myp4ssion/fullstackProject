import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import classes from "./ModalOfferNews.module.scss";
import fonts from "@/scss/fonts.module.scss";

import CrossSvg from "@/assets/cross.svg";
import ClipSvg from "@/assets/clip.svg";

import { OfferNewsInterfase, OfferFileInterfase } from "@/types/types";
import ImageComponent from "../ImageComponent/ImageComponent";
import AudioComponent from "../AudioComponent/AudioComponent";
import PdfComponent from "../PdfComponent/PdfComponent";
import FileComponentTwo from "../FileComponentTwo/FileComponentTwo";

import { MainPaths } from "@/types/types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { postNews } from "@/http/newsAPI";
import { deleteOfferNews } from "@/http/offerNewsAPI";
import Loading from "../Loading/Loading";

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

const ModalOfferNews: FC<{
  modalInfo: OfferNewsInterfase | any;
  setShowModal: (value: boolean) => void;
  handleDeleteNews: (id: number) => void;
}> = ({ modalInfo, setShowModal, handleDeleteNews }) => {
  const [title, setTitle] = useState(modalInfo.title);
  const [description, setDescription] = useState(modalInfo.description);
  const [videoUrl, setVideoUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [audios, setAudios] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
  const [userFiles, setUserFiles] = useState([]);
  const [theme, setTheme] = useState(MainPaths.Theater);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isPending, setIsPending] = useState(true);

  const allImages = files.filter((file) => regexImage.test(file.name));

  useEffect(() => {
    async function fetchFiles(offerFile: OfferFileInterfase) {
      const response = await fetch(`http://localhost:5000/${offerFile.name}`);
      const blob = await response.blob();

      const file = new File([blob], offerFile.name, { type: blob.type });
      setFiles((prev) => [...prev, file]);
      setImages((prev) =>
        offerFile.type === "image" ? [...prev, file] : prev
      );
      setAudios((prev) =>
        offerFile.type === "audio" ? [...prev, file] : prev
      );
      setPdfs((prev) => (offerFile.type === "pdf" ? [...prev, file] : prev));
    }

    Promise.all(
      // @ts-ignore
      modalInfo.offerFile.map((file) => fetchFiles(file))
    )
      .then()
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsPending(false));
  }, []);

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
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (videoUrl) {
      formData.append("video_url", videoUrl);
    }
    postNews(formData)
      .then(() => setShowModal(false))
      .catch((error) => setError(error.message));
  };

  const handleClickDeleteButton = () => {
    setShowConfirmDelete(true);
  };

  const onDeleteNews = (id: number) => {
    setShowModal(false);
    handleDeleteNews(id);
  };

  const handleAcceptDelete = (id: number) => {
    setShowConfirmDelete(false);
    deleteOfferNews(id)
      .then(() => onDeleteNews(id))
      .catch((error) => setError(error.message));
  };

  const handleRejectDelete = () => {
    setShowConfirmDelete(false);
  };

  function handleDeleteFile(name: string) {
    setImages((prev) => [
      ...prev.filter((inputFile) => inputFile.name !== name),
    ]);
    setAudios((prev) => [
      ...prev.filter((inputFile) => inputFile.name !== name),
    ]);
    setPdfs((prev) => [...prev.filter((inputFile) => inputFile.name !== name)]);
    setFiles((prev) => [
      ...prev.filter((inputFile) => inputFile.name !== name),
    ]);
  }

  const handleSubmit = () => {
    if (!title) {
      setError("Не указана тема");
      return;
    }

    if (!description) {
      setError("Не указано описание");
      return;
    }

    if (files.length === 0) {
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
    setFiles((prev) => [...prev, ...newFiles]);
    setUserFiles((prev) => [...prev, ...newFiles]);
    inputFileRef.current.value = "";
  }

  return (
    <div className={classes.modalOfferNewsContainer}>
      {showConfirmSubmit && (
        <ConfirmModal
          message="Опубликовать новость? После публикации не забудьте удалить предложенную запись"
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      )}
      {showConfirmDelete && (
        <ConfirmModal
          message="Удалить предложенную новость?"
          handleAccept={() => handleAcceptDelete(modalInfo.id)}
          handleReject={handleRejectDelete}
        />
      )}
      <div className={classes.modalInfoContainer}>
        <div className={classes.topContainer}>
          <span className={`${classes.modalTitle} ${fonts.u500}`}>
            Предложенная публикация
          </span>
          <div className={classes.topRight}>
            <div className={classes.datesContainer}>
              <span className={`${classes.defaultText} ${fonts.g300}`}>
                Предложено:{" "}
                {new Intl.DateTimeFormat("ru-RU").format(
                  new Date(modalInfo.createdAt)
                )}
              </span>
            </div>
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
            <span className={`${classes.defaultText} ${fonts.g300}`}>
              Email отправителя:
            </span>
            <span
              style={{ color: "#000" }}
              className={`${classes.defaultText} ${fonts.g300}`}
            >
              {modalInfo.email}
            </span>
          </div>
          <div className={classes.rightContainer}>
            <div className={classes.filesContainer}>
              <span className={`${classes.defaultText} ${fonts.g300}`}>
                Предложенные файлы:
              </span>
              {isPending && <Loading />}
              <div className={classes.imagesContainer}>
                {!isPending &&
                  images.map((image) => (
                    <ImageComponent
                      handleDelete={handleDeleteFile}
                      key={image.name}
                      imageName={image.name}
                    />
                  ))}
              </div>
              <div className={classes.audiosContainer}>
                {!isPending &&
                  audios.map((audio) => (
                    <AudioComponent
                      handleDelete={handleDeleteFile}
                      key={audio.name}
                      audioName={audio.name}
                    />
                  ))}
              </div>
              <div className={classes.pdfsContainer}>
                {!isPending &&
                  pdfs.map((pdf) => (
                    <PdfComponent
                      handleDelete={handleDeleteFile}
                      key={pdf.name}
                      pdfName={pdf.name}
                    />
                  ))}
              </div>
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
              <span className={fonts.g300}>
                Форматы: png, jpg, jpeg, pdf, mp3
              </span>
              <span style={{ fontSize: "10px" }} className={fonts.g300}>
                Размер файлов больше чем 10мб может негативно повлиять на
                скорость загрузки!
              </span>
              <span style={{ fontSize: "10px" }} className={fonts.g300}>
                Рекомендуется сжимать большие файлы перед отправкой
              </span>
              <div className={classes.fileContainer}>
                {userFiles ? (
                  userFiles?.map((file) => (
                    <FileComponentTwo
                      file={file}
                      setUserFiles={setUserFiles}
                      setFiles={setFiles}
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
                  onClick={handleClickDeleteButton}
                  className={`${classes.deleteButton} ${fonts.u500}`}
                >
                  Удалить
                </button>
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

export default ModalOfferNews;
