import classes from "./Loading.module.scss";
import fonts from "@/scss/fonts.module.scss";

const Loading = () => {
  return (
    <div className={classes.loadingContainer}>
      <div className={classes.elementsContainer}>
        <span className={`${classes.text} ${fonts.u500}`}>Загрузка</span>
        <span className={`${classes.elem1} ${fonts.u500}`}>.</span>
        <span className={`${classes.elem2} ${fonts.u500}`}>.</span>
        <span className={`${classes.elem3} ${fonts.u500}`}>.</span>
      </div>
    </div>
  );
};

export default Loading;
