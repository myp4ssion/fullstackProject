import { FC, RefObject } from "react";
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import classes from "./Modal.module.scss";

const Modal: FC<{
  divRef: RefObject<HTMLDivElement>;
  setOpen: (value: boolean) => void;
}> = ({ divRef, setOpen }) => {
  return (
    <div className={classes.modalContainer}>
      <MobileNavBar setOpen={setOpen} divRef={divRef} />
    </div>
  );
};

export default Modal;
