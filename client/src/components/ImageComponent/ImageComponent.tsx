import { FC } from "react";
import classes from "./ImageComponent.module.scss";

import CrossSvg from "@/assets/cross.svg";

const ImageComponent: FC<{
  imageName: string;
  handleDelete: (value: string) => void;
}> = ({ imageName, handleDelete }) => {
  return (
    <div className={classes.imageContainer}>
      <a href={`http://localhost:5000/${imageName}`} target="_blank">
        <img
          className={classes.image}
          alt="image"
          src={`http://localhost:5000/${imageName}`}
        />
      </a>
      <CrossSvg
        onClick={() => handleDelete(imageName)}
        className={classes.cross}
      />
    </div>
  );
};

export default ImageComponent;
