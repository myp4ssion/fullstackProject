import { ChildrenProp } from "@/types/types";
import classes from "./Carousel.module.scss";

import RightArrow from "@/assets/rightArrow.svg";
import RightArrowDisabled from "@/assets/rightArrowDisabled.svg";
import Dott from "@/assets/dott.svg";
import DottActive from "@/assets/dottActive.svg";

import {
  Children,
  cloneElement,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const Carousel: FC<ChildrenProp> = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(600);
  const [selectedPage, setSelectedPage] = useState(1);

  const windowRef = useRef();

  const maxOffset = -(width * (pages.length - 1));

  useEffect(() => {
    setPages(
      Children.map(children, (child) => {
        if (child === null) return;
        //@ts-ignore
        return cloneElement(child, {
          style: {
            //@ts-ignore
            height: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            // backgroundColor: "#F2F2F2",
          },
        });
      })
    );
  }, []);

  const resizeHandler = () => {
    //@ts-ignore
    const _width = windowRef.current.offsetWidth;
    setWidth(_width);
    setOffset(0);
    setSelectedPage(1);
  };

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const handleLeftArrowClick = () => {
    //@ts-ignore
    const _width = windowRef.current.offsetWidth;
    setWidth(_width);
    setSelectedPage((prev) => prev - 1);
    setOffset((prev) => {
      const newOffset = prev + _width;
      return Math.min(newOffset, 0);
    });
  };

  const handleRightArrowClick = () => {
    //@ts-ignore
    const _width = windowRef.current.offsetWidth;
    setWidth(_width);
    setSelectedPage((prev) => prev + 1);
    setOffset((prev) => {
      const newOffset = prev - _width;
      return Math.max(newOffset, maxOffset);
    });
  };

  const handleSelectPage = (i: number) => {
    //@ts-ignore
    const _width = windowRef.current.offsetWidth;
    setWidth(_width);
    setOffset((prev) => {
      const newOffset = -i * _width;
      return Math.max(newOffset, maxOffset);
    });
    setSelectedPage(i + 1);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.window} ref={windowRef}>
        <div
          className={classes.allPagesContainer}
          style={{
            transform: `translateX(${offset}px)`,
          }}
        >
          {pages}
        </div>
      </div>
      {pages.length > 1 && (
        <div className={classes.bottomItems}>
          <div className={classes.arrowContainer}>
            {selectedPage === 1 ? (
              <RightArrowDisabled
                className={classes.arrow}
                style={{ transform: "rotate(180deg)" }}
              />
            ) : (
              <RightArrow
                className={`${classes.arrow} ${classes.arrowActive}`}
                style={{ transform: "rotate(180deg)" }}
                onClick={handleLeftArrowClick}
              />
            )}
          </div>
          <div className={classes.imageDottContainer}>
            {pages.map((page, i) =>
              i + 1 === selectedPage ? (
                <DottActive
                  className={classes.dott}
                  key={i}
                  style={{ userSelect: "none" }}
                />
              ) : (
                <Dott
                  className={classes.dott}
                  key={i}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSelectPage(i)}
                />
              )
            )}
          </div>
          <div className={classes.arrowContainer}>
            {selectedPage === pages.length ? (
              <RightArrowDisabled className={classes.arrow} />
            ) : (
              <RightArrow
                className={`${classes.arrow} ${classes.arrowActive}`}
                onClick={handleRightArrowClick}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
