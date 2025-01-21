import { Link, Outlet } from "react-router-dom";
import { useRef, useState } from "react";

import Header from "../Header/Header";
import NavBar from "../NavBar/NavBar";
import Form from "../Form/Form";
import MovingItems from "../MovingItems/MovingItems";
import BottomHeader from "../BottomHeader/BottomHeader";

import classes from "./App.module.scss";
import fonts from "@/scss/fonts.module.scss";

import { NotificationItem } from "@/types/types";
import Notification from "../Notification/Notification";
import Footer from "../Footer/Footer";
import NavBarBurger from "../NavBarBurger/NavBarBurger";

export const App = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (
    message: string,
    type: "success" | "error" | "warn"
  ) => {
    setNotifications((prev) => [...prev, { message, type, id: Date.now() }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app-container">
      <Header>
        <div>
          <div className={classes.navContainer}>
            <NavBar divRef={divRef} />
          </div>
          <div className={classes.navMobileContainer}>
            <NavBarBurger divRef={divRef} />
          </div>
          <div className={classes.movingContainer}>
            <MovingItems
              direction="rotateWrapperRight"
              textColor="#FF9340"
              starNum="firstStar"
            />
            <MovingItems
              direction="rotateWrapperLeft"
              textColor="#D9BBFF"
              starNum="secondStar"
            />
          </div>
        </div>
        <BottomHeader />
      </Header>
      <div ref={divRef} className={classes.hiddenDiv}></div>
      <Outlet />
      <Form addNotification={addNotification} />
      <Footer divRef={divRef} />

      <div className={classes.notificationContainer}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            notId={notification.id}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};
