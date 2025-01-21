import { NavLink } from "react-router-dom";

import classes from "./MobileNavBar.module.scss";
import fonts from "@/scss/fonts.module.scss";
import { FC, RefObject } from "react";

const MobileNavBar: FC<{
  divRef: RefObject<HTMLDivElement>;
  setOpen: null | ((value: boolean) => void);
}> = ({ divRef, setOpen }) => {
  const scrollToDiv = () => {
    divRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    if (setOpen) {
      setOpen(false);
    }
  };
  return (
    <div className={`${classes.nav} ${fonts.u500}`}>
      <NavLink onClick={scrollToDiv} className={classes.navLink} to="/theater">
        ТЕАТР
      </NavLink>
      <NavLink onClick={scrollToDiv} className={classes.navLink} to="/music">
        МУЗЫКА
      </NavLink>
      <NavLink onClick={scrollToDiv} className={classes.navLink} to="/scene">
        СЦЕНА
      </NavLink>
      <NavLink onClick={scrollToDiv} className={classes.navLink} to="/movie">
        КИНО
      </NavLink>
      <NavLink
        onClick={scrollToDiv}
        className={classes.navLink}
        to="/literature"
      >
        ЛИТЕРАТУРА
      </NavLink>
      <NavLink onClick={scrollToDiv} className={classes.navLink} to="/art">
        ИЗО
      </NavLink>
    </div>
  );
};

export default MobileNavBar;
