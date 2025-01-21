import ArrowElipse from "@/assets/arrovElipse.svg";

import classes from "./BottomHeader.module.scss";
import fonts from "@/scss/fonts.module.scss";

const headerDescription =
  "Юмор встречается в самых разных сферах жизни, даруя радость и легкость. В музыке он звучит в пародиях и неожиданных мелодиях, в театре — в остроумных репликах и комичных ситуациях. В кино он может проявляться через абсурдные сцены и пародии на известные жанры, а в литературе — через ироничные персонажи и языковые игры. Даже в изобразительном искусстве юмор находит своё место, используя необычные образы и сатирические элементы. Юмор помогает воспринимать мир легче и с улыбкой.";

const BottomHeader = () => {
  return (
    <div className={classes.bottomContainer}>
      <div>
        <ArrowElipse className={classes.arrowElipse} />
      </div>
      <div>
        <p className={fonts.g300}>{headerDescription}</p>
      </div>
    </div>
  );
};

export default BottomHeader;
