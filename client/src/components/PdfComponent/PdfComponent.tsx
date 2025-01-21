import { FC } from "react";
import classes from "./PdfComponent.module.scss";
import fonts from "@/scss/fonts.module.scss";
import PdfSvg from "@/assets/pdf.svg";
import CrossSvg from "@/assets/cross.svg";

const PdfComponent: FC<{
  pdfName: string;
  handleDelete: (value: string) => void;
}> = ({ pdfName, handleDelete }) => {
  return (
    <div className={classes.pdfContainer}>
      <a href={`http://localhost:5000/${pdfName}`} target="_blank">
        <div className={classes.pdf}>
          <PdfSvg width={60} height={60} />
          <span
            className={`${classes.pdfName} ${fonts.g300}`}
          >{`${pdfName.substring(0, 6)}...`}</span>
        </div>
      </a>
      <CrossSvg
        onClick={() => handleDelete(pdfName)}
        className={classes.cross}
      />
    </div>
  );
};

export default PdfComponent;
