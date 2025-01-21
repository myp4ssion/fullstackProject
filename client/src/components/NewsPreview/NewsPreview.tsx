import { FC } from "react";
import classes from "./NewsPreview.module.scss";
import fonts from "@/scss/fonts.module.scss";

import TrashSvg from "@/assets/trash.svg";

const NewsPreview: FC<{
  title: string;
  description: string;
  clickFunction: () => void;
  handleDeleteNews: () => void;
}> = ({ title, description, clickFunction, handleDeleteNews }) => {
  const handleClickDeleteButton = (e: any) => {
    e.stopPropagation();
    handleDeleteNews();
  };

  return (
    <div onClick={clickFunction} className={classes.newsPreviewContainer}>
      <div className={classes.infoContainer}>
        <p className={`${classes.newsTitle} ${fonts.u500}`}>{title}</p>
        <p className={`${classes.newsDescription} ${fonts.g300}`}>
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
      </div>
      <TrashSvg
        onClick={handleClickDeleteButton}
        className={classes.trashSvg}
      />
    </div>
  );
};

export default NewsPreview;
