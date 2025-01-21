import { FC } from "react";
import classes from "./File.module.scss";
import fonts from "@/scss/fonts.module.scss";

const FileComponentTwo: FC<any> = ({ file, setUserFiles, setFiles }) => {
  function handleDeleteFile(name: string) {
    setUserFiles((prev: any) => [
      ...prev.filter((inputFile: any) => inputFile.name !== file.name),
    ]);
    setFiles((prev: any) => [
      ...prev.filter((inputFile: any) => inputFile.name !== file.name),
    ]);
  }

  return (
    <div className={classes.fileContainer}>
      <span className={fonts.g300}>{`${file.name.slice(0, 10)}${
        file.name.slice(11) ? "..." : ""
      }`}</span>
      <span
        className={classes.deleteFile}
        onClick={() => handleDeleteFile(file.name)}
      >
        &#x2716;
      </span>
    </div>
  );
};

export default FileComponentTwo;
