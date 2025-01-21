import classes from "./Notification.module.scss";
import fonts from "@/scss/fonts.module.scss";

import WarnSvg from "@/assets/warn.svg";
import ErrorSvg from "@/assets/error.svg";
import SuccessSvg from "@/assets/success.svg";

import { FC, useCallback, useEffect } from "react";

import { NotificationProps } from "@/types/types";

const Notification: FC<NotificationProps> = ({
  message,
  type,
  onClose,
  notId,
}) => {
  const onCloseCallback = useCallback(() => onClose(notId), [notId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseCallback();
    }, 4000);

    // return () => clearTimeout(timer);
  }, [onCloseCallback]);

  return (
    <div className={`${classes.notification} ${classes[type]}`}>
      {type === "success" ? (
        <SuccessSvg className={classes.svg} />
      ) : type === "warn" ? (
        <WarnSvg className={classes.svg} />
      ) : (
        <ErrorSvg className={classes.svg} />
      )}
      <h2 className={fonts.u500}>
        {type === "success"
          ? "УСПЕШНО"
          : type === "warn"
          ? "ПРЕДУПРЕЖДЕНИЕ"
          : "ОШИБКА"}
      </h2>
      <span className={fonts.g300}>{message}</span>
    </div>
  );
};

export default Notification;
