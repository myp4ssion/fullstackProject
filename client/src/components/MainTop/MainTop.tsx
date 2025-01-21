import { FC } from "react";
import classes from "./MainTop.module.scss";
import fonts from "@/scss/fonts.module.scss";

import { MainTopProps } from "@/types/types";
import { MainTitles } from "@/types/types";

const MainTop: FC<MainTopProps> = ({ mainTitle, mainText }) => {
  return (
    <div className={classes.mainTopContainer}>
      <div
        style={mainTitle === MainTitles.Leterature ? { gap: 0 } : {}}
        className={classes.contentContainer}
      >
        <h1 className={fonts.u500}>ЮМОР</h1>
        <div
          style={
            mainTitle === MainTitles.Leterature
              ? { flexDirection: "column" }
              : {}
          }
          className={classes.bottomContentContainer}
        >
          <p
            className={fonts.g300}
            style={mainTitle === MainTitles.Leterature ? { order: 2 } : {}}
          >
            {mainText}
          </p>
          <h1
            style={mainTitle === MainTitles.Leterature ? { order: 1 } : {}}
            className={fonts.u500}
          >
            {mainTitle}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MainTop;
