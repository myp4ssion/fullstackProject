import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

import classes from "./NavBar.module.scss";
import fonts from "@/scss/fonts.module.scss";

// import Logo from "@/assets/logo.svg";
import Logo from "@/assets/logo.png";
import { FC, RefObject } from "react";

const NavBar: FC<{ divRef: RefObject<HTMLDivElement> }> = ({ divRef }) => {
  const scrollToDiv = () => {
    divRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className={`${classes.nav} ${fonts.u500}`}>
      <div>
        <Link to="/">
          <img src={Logo} className={classes.logo} />
        </Link>
      </div>
      <div>
        <NavLink
          onClick={scrollToDiv}
          className={classes.navLink}
          to="/theater"
        >
          ТЕАТР
        </NavLink>
        <span className={classes.span}></span>
        <NavLink onClick={scrollToDiv} className={classes.navLink} to="/music">
          МУЗЫКА
        </NavLink>
        <span className={classes.span}></span>
        <NavLink onClick={scrollToDiv} className={classes.navLink} to="/scene">
          СЦЕНА
        </NavLink>
        <span className={classes.span}></span>
        <NavLink onClick={scrollToDiv} className={classes.navLink} to="/movie">
          КИНО
        </NavLink>
        <span className={classes.span}></span>
        <NavLink
          onClick={scrollToDiv}
          className={classes.navLink}
          to="/literature"
        >
          ЛИТЕРАТУРА
        </NavLink>
        <span className={classes.span}></span>
        <NavLink onClick={scrollToDiv} className={classes.navLink} to="/art">
          ИЗО
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
