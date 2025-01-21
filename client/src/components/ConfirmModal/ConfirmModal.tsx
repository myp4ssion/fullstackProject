import { FC } from "react";
import classes from "./ConfirmModal.module.scss";
import fonts from "@/scss/fonts.module.scss";

const ConfirmModal: FC<{
  message: string;
  handleAccept: () => void;
  handleReject: () => void;
}> = ({ message, handleAccept, handleReject }) => {
  return (
    <div className={classes.confirmModalContainer}>
      <div className={classes.contentContainer}>
        <span className={`${classes.message} ${fonts.g300}`}>{message}</span>
        <div className={classes.buttons}>
          <button
            onClick={handleAccept}
            className={`${classes.buttonAccept} ${fonts.u500}`}
          >
            Да
          </button>
          <button
            onClick={handleReject}
            className={`${classes.buttonReject} ${fonts.u500}`}
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
