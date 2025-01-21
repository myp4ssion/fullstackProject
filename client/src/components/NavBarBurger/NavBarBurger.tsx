import classes from "./NavBarBurger.module.scss";

import Logo from "@/assets/logo.png";
import BurgerSvg from "@/assets/burger.svg";
import CrossSvg from "@/assets/cross.svg";

import { Link } from "react-router-dom";
import { FC, RefObject, useState } from "react";
import Modal from "../Modal/Modal";

const NavBarBurger: FC<{ divRef: RefObject<HTMLDivElement> }> = ({
  divRef,
}) => {
  const [open, setOpen] = useState(false);

  function handleClickBurgerIcon() {
    setOpen((prev) => !prev);
  }

  return (
    <div
      className={
        open
          ? `${classes.navBarBurgerContainer} ${classes.positionFixed}`
          : `${classes.navBarBurgerContainer}`
      }
    >
      <div className={classes.navContainerTop}>
        <Link to={"/"}>
          <img src={Logo} height={58} />
        </Link>

        {open ? (
          <CrossSvg
            onClick={handleClickBurgerIcon}
            className={classes.icon}
            width={40}
            height={40}
          />
        ) : (
          <BurgerSvg
            onClick={handleClickBurgerIcon}
            className={classes.icon}
            width={40}
            height={40}
          />
        )}
      </div>

      {open && (
        <div className={classes.modalContainer}>
          <Modal setOpen={setOpen} divRef={divRef} />
        </div>
      )}
    </div>
  );
};

export default NavBarBurger;
