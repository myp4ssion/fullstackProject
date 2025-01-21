import { FC } from "react";
import classes from "./PublishedNewsPreview.module.scss";
import fonts from "@/scss/fonts.module.scss";

const PublishedNewsPreview: FC<{
  title: string;
  description: string;
  clickFunction: () => void;
}> = ({ title, description, clickFunction }) => {
  return (
    <div onClick={clickFunction} className={classes.newsPreviewContainer}>
      <div className={classes.infoContainer}>
        <p className={`${classes.newsTitle} ${fonts.u500}`}>
          {title.length > 50 ? `${description.substring(0, 50)}...` : title}
        </p>
        <p className={`${classes.newsDescription} ${fonts.g300}`}>
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
      </div>
    </div>
  );
};

export default PublishedNewsPreview;
