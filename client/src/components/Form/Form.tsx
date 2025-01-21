import { ChangeEvent, FormEvent, useRef, useState, FC, RefObject } from "react";

import classes from "./Form.module.scss";
import fonts from "@/scss/fonts.module.scss";

import { FormProps } from "@/types/types";

import File from "../FileComponent/FileComponent";

import Clip from "@/assets/clip.svg";
import { send } from "@/http/offerNewsAPI";

const Form: FC<FormProps> = ({ addNotification }) => {
  const [inputFiles, setInputFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const inputFileRef = useRef(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const maxFiles = 5;
  const maxSize = 1024 * 1024 * 2;

  function onAddFile(e: ChangeEvent<HTMLInputElement>) {
    const regex = /\.(png|jpg|jpeg|pdf|mp3)$/;
    const selectedFiles = e.target.files;
    const newFiles = [...Array.from(selectedFiles)];
    if ([...inputFiles, ...Array.from(selectedFiles)].length > maxFiles) {
      addNotification(`Нельзя добавить больше ${maxFiles} файлов`, "warn");
      inputFileRef.current.value = "";
      return;
    }
    for (let file of newFiles) {
      if (inputFiles.find((oldFile) => oldFile.name === file.name)) {
        addNotification(`Файл с именем ${file.name} уже добавлен`, "warn");
        return;
      }
      if (!regex.test(file.name)) {
        addNotification(`${file.name}: неподдерживаемый тип`, "warn");
        return;
      }
      // console.log(inputFiles.find((oldFile) => oldFile.name === file.name));
    }
    newFiles.forEach((file) => {
      if (file.size > maxSize) {
        addNotification(`Размер файла ${file.name} больше 2Мб`, "warn");
        return;
      }
    });
    const newFilteredFiles = newFiles.filter((file) => file.size < maxSize);
    setInputFiles((prev) => [...prev, ...newFilteredFiles]);
    inputFileRef.current.value = "";
  }

  function checkValidityInputs(
    ref: RefObject<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const elem = ref;
    if (!elem.current.checkValidity()) {
      elem.current.style.color = "#D21717";
      elem.current.style.outlineColor = "#D21717";
    } else {
      elem.current.style.color = "black";
      elem.current.style.outlineColor = "#979797";
    }
  }

  function handleChangeTitle(e: FormEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value);
    checkValidityInputs(titleRef);
  }

  function handleChangeDescription(e: FormEvent<HTMLTextAreaElement>) {
    setDescription(e.currentTarget.value);
    checkValidityInputs(descriptionRef);
  }

  function handleChangeEmail(e: FormEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
    checkValidityInputs(emailRef);
  }

  function handleClearFiles() {
    inputFileRef.current.value = "";
    setInputFiles([]);
  }

  function handleForm(e: FormEvent) {
    e.preventDefault();
    checkValidityInputs(titleRef);
    checkValidityInputs(descriptionRef);
    checkValidityInputs(emailRef);
    if (
      !titleRef.current.checkValidity() ||
      !descriptionRef.current.checkValidity() ||
      !emailRef.current.checkValidity()
    ) {
      addNotification("Не все поля заполнены", "warn");
      return;
    }
    if (title.length > 50) {
      addNotification("Длина темы не может быть больше 50 символов", "warn");
      return;
    }
    if (description.length > 350) {
      addNotification(
        "Длина описания не может быть больше 350 символов",
        "warn"
      );
      return;
    }
    if (email.length > 50) {
      addNotification("Длина Email не может быть больше 50 символов", "warn");
      return;
    }

    const onSuccessSend = () => {
      addNotification(
        "Предложенная Вами тема будет рассмотрена для публикации.",
        "success"
      );
      setTitle("");
      setDescription("");
      setEmail("");
      setInputFiles([]);
    };

    buttonRef.current.disabled = true;
    titleRef.current.disabled = true;
    emailRef.current.disabled = true;
    descriptionRef.current.disabled = true;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("email", email);
    inputFiles.forEach((file) => {
      formData.append("files", file);
    });
    send(formData)
      .then((data) => onSuccessSend())

      .catch((error) => addNotification(error.message, "error"))
      .finally(() => {
        buttonRef.current.disabled = false;
        titleRef.current.disabled = false;
        emailRef.current.disabled = false;
        descriptionRef.current.disabled = false;
      });
  }

  function handleFilePickerRef() {
    inputFileRef.current.click();
  }

  return (
    <div className={classes.formContainer}>
      <div className={classes.titleContainer}>
        <h1 className={fonts.u500}>ПРЕДЛОЖИТЬ</h1>
        <h1 className={fonts.u500}>ПУБЛИКАЦИЮ</h1>
      </div>

      <form noValidate onSubmit={handleForm} className={classes.form}>
        <div className={classes.inputContainer}>
          <div>
            <input
              value={title}
              onChange={handleChangeTitle}
              className={fonts.g300}
              name="theme"
              type="text"
              placeholder="Тема"
              ref={titleRef}
              maxLength={50}
              required
            />
            <input
              value={email}
              onChange={handleChangeEmail}
              className={fonts.g300}
              name="email"
              type="email"
              placeholder="Ваш Email"
              ref={emailRef}
              maxLength={50}
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={handleChangeDescription}
              className={fonts.g300}
              name="description"
              placeholder="Описание"
              maxLength={350}
              ref={descriptionRef}
              required
            ></textarea>
          </div>
        </div>

        <div
          className={`${classes.filePickerBtn} ${fonts.g300}`}
          onClick={handleFilePickerRef}
        >
          Прикрепить файлы
          <Clip className={classes.clip} />
        </div>
        <span className={fonts.g300}>Форматы: png, jpg, jpeg, pdf, mp3</span>
        <div className={classes.fileContainer}>
          {inputFiles ? (
            inputFiles?.map((file) => (
              <File file={file} setInputFiles={setInputFiles} key={file.name} />
            ))
          ) : (
            <></>
          )}
        </div>

        <button ref={buttonRef} className={`${classes.submit} ${fonts.u500}`}>
          Отправить
        </button>

        <input
          className={classes.inputHidden}
          ref={inputFileRef}
          type="file"
          multiple
          onChange={onAddFile}
          accept=".png, .jpg, .jpeg, .pdf, .mp3"
        />

        {/* <button
          onClick={() =>
            addNotification(
              "Предложенная Вами тема будет рассмотрена для публикации.",
              "success"
            )
          }
        >
          Успех
        </button>
        <button
          onClick={() => addNotification("Не все поля заполнены", "warn")}
        >
          Предупреждение
        </button>
        <button
          onClick={() => addNotification("Произошла ошибка отправки", "error")}
        >
          Ошибка
        </button> */}
      </form>
    </div>
  );
};

export default Form;
