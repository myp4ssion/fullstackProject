import classes from "./MovingItems.module.scss";
import Star from "@/assets/star.svg";
import { StarProps } from "@/types/types";
import { FC } from "react";
import fonts from "@/scss/fonts.module.scss";

const MovingItems: FC<StarProps> = ({ textColor, starNum, direction }) => {
  return (
    <div className={classes[direction]}>
      <div className={classes.animateDiv}>
        <h1 style={{ color: textColor }} className={fonts.u600}>
          Культура юмора
        </h1>
        <span>
          <Star className={classes[starNum]} />
        </span>
      </div>
      <div className={classes.animateDiv}>
        <h1 style={{ color: textColor }} className={fonts.u600}>
          Культура юмора
        </h1>
        <span>
          <Star className={classes[starNum]} />
        </span>
      </div>
      <div className={classes.animateDiv}>
        <h1 style={{ color: textColor }} className={fonts.u600}>
          Культура юмора
        </h1>
        <span>
          <Star className={classes[starNum]} width={45} height={45} />
        </span>
      </div>
    </div>
  );
};

export default MovingItems;
