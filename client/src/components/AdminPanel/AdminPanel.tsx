import { FC, useState } from "react";
import classes from "./AdminPanel.module.scss";
import fonts from "@/scss/fonts.module.scss";
import ButtonsContainer from "../ButtonsContainer/ButtonsContainer";
import OfferNews from "../OfferNews/OfferNews";
import PublishedNews from "../PublishedNews/PublishedNews";

const AdminPanel: FC<{ setAuth: (value: boolean) => void }> = ({ setAuth }) => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <main className={classes.main}>
      <div className={classes.contentContainer}>
        <ButtonsContainer
          setAuth={setAuth}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        {activeTab === 1 && <OfferNews />}
        {activeTab === 2 && <PublishedNews />}
      </div>
    </main>
  );
};

export default AdminPanel;
