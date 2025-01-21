import { FC } from "react";
import { ChildrenProp } from "@/types/types";

import classes from "./Header.module.scss";

const Header: FC<ChildrenProp> = ({ children }) => {
  return <header className={classes.header}>{children}</header>;
};

export default Header;
