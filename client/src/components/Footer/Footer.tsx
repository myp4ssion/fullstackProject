import { ChildrenProp } from "@/types/types";

import { FC, RefObject } from "react";

import classes from "./Footer.module.scss";
import fonts from "@/scss/fonts.module.scss";

import Logo from "@/assets/logo.png";

import NavBar from "../NavBar/NavBar";
import TgSvg from "@/assets/tg.svg";
import VkSvg from "@/assets/vk.svg";
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import CopyrightSvg from "@/assets/copyright.svg";
import { Link } from "react-router-dom";

const Footer: FC<{ divRef: RefObject<HTMLDivElement> }> = ({ divRef }) => {
  return (
    <footer className={classes.footer}>
      <div className={classes.navMidContainer}>
        <NavBar divRef={divRef} />
        <p className={`${fonts.u600} ${classes.title}`}>Культура юмора</p>
      </div>

      <div className={classes.secondNavContainer}>
        <MobileNavBar setOpen={null} divRef={divRef} />
        <Link to={"/"}>
          <img src={Logo} className={classes.logo} />
        </Link>
      </div>

      <div className={classes.footerMidBottomContainer}>
        <div className={classes.footerBottom}>
          <p className={fonts.u300}>
            <CopyrightSvg />
            Все права защищены
          </p>
          <div>
            <a href="https://tg.com" target="_blank">
              <TgSvg className={classes.socialMedia} width={40} height={40} />
            </a>
            <a href="https://vk.com" target="_blank">
              <VkSvg className={classes.socialMedia} width={40} height={40} />
            </a>
          </div>
          <p className={fonts.u300}>2024</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
