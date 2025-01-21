import { FC, RefObject } from "react";
import classes from "./SelectPage.module.scss";
import fonts from "@/scss/fonts.module.scss";

const SelectPage: FC<{
  numPage: number;
  page: number;
  setPage: (value: number) => void;
  divRef: RefObject<HTMLDivElement> | null;
}> = ({ numPage, page, setPage, divRef }) => {
  const handlePageClick = (numPage: number) => {
    if (numPage !== page) {
      setPage(numPage);
      scrollToDiv();
    }
  };

  const scrollToDiv = () => {
    if (divRef !== null) {
      divRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      onClick={() => handlePageClick(numPage)}
      style={numPage === page ? { backgroundColor: "#FF9340" } : {}}
      className={classes.onePageContainer}
    >
      <span className={`${fonts.g300} ${classes.textPage}`}>{numPage}</span>
    </div>
  );
};

export default SelectPage;
