import { FC } from "react";
import classes from "./ButtonsContainer.module.scss";
import fonts from "@/scss/fonts.module.scss";

const ButtonsContainer: FC<{
  setAuth: (value: boolean) => void;
  setActiveTab: (value: number) => void;
  activeTab: number;
}> = ({ setAuth, setActiveTab, activeTab }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  const handleSelectTabClick = (value: number) => {
    setActiveTab(value);
  };

  return (
    <div className={classes.buttonsContainer}>
      <div>
        <button
          onClick={() => handleSelectTabClick(1)}
          style={
            activeTab === 1 ? { backgroundColor: "#fff", color: "#1223b9" } : {}
          }
          className={`${classes.button} ${fonts.u500}`}
        >
          Предложенные
        </button>
        <button
          onClick={() => handleSelectTabClick(2)}
          style={
            activeTab === 2 ? { backgroundColor: "#fff", color: "#1223b9" } : {}
          }
          className={`${classes.button} ${fonts.u500}`}
        >
          Опубликованные
        </button>
      </div>
      <button
        className={`${classes.logOutButton} ${fonts.u500}`}
        onClick={handleLogoutClick}
      >
        Выйти
      </button>
    </div>
  );
};

export default ButtonsContainer;
