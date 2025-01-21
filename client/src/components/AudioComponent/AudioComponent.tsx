import { FC } from "react";
import classes from "./AudioComponent.module.scss";

import CrossSvg from "@/assets/cross.svg";

const AudioComponent: FC<{
  audioName: string;
  handleDelete: (value: string) => void;
}> = ({ audioName, handleDelete }) => {
  return (
    <div className={classes.audioContainer}>
      <audio
        className={classes.audio}
        controls
        src={`http://localhost:5000/${audioName}`}
      >
        Не поддерживаемый формат <code>audio</code>
      </audio>
      <CrossSvg
        onClick={() => handleDelete(audioName)}
        className={classes.cross}
      />
    </div>
  );
};

export default AudioComponent;
