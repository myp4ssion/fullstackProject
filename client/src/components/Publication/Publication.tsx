import { PublicationInterfase } from "@/types/types";
import { FC, useEffect, useRef } from "react";

import fonts from "@/scss/fonts.module.scss";
import classes from "./Publication.module.scss";
import Carousel from "../Carousel/Carousel";

import PdfSvg from "@/assets/pdf.svg";

const regexRutube =
  /^https?:\/\/(www\.)?rutube\.ru\/play\/embed\/[a-f0-9]+\/?$/;
const regexVkvideo = /^https?:\/\/(www\.)?vkvideo\.ru\/video_ext\.php\?(.*)$/;
const urlRegex = /(https?:\/\/[^\s]+)/g;

const Publication: FC<PublicationInterfase> = ({
  id,
  title,
  description,
  video_url,
  image,
  pdf,
  audio,
  createdAt,
  updatedAt,
}) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    function addLinks(text: string) {
      return text.replace(
        urlRegex,
        '<a href="$1" target="_blank" style="color: #1223b9">$1</a>'
      );
    }
    const serverText = description;
    paragraphRef.current.innerHTML = addLinks(serverText);
    paragraphRef.current.style.whiteSpace = "pre-line";
  }, []);

  return (
    <section className={classes.publicationContainer}>
      <div className={classes.contentContainer}>
        <h1 className={`${classes.title} ${fonts.u500}`}>{title}</h1>
        <div className={classes.middleContentContainer}>
          <p
            ref={paragraphRef}
            className={`${classes.description} ${fonts.g300}`}
          >
            {description}
          </p>
          <div className={classes.rightContainer}>
            <Carousel>
              {regexRutube.test(video_url) && (
                <div className={classes.item}>
                  <iframe
                    className={classes.iframe}
                    src={video_url}
                    allow="clipboard-write"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {regexVkvideo.test(video_url) && (
                <div className={classes.item}>
                  <iframe
                    className={classes.iframe}
                    src={video_url}
                    allow="encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {image.map((currentImage) => (
                <div className={classes.imageContainer} key={currentImage.id}>
                  <img
                    className={classes.image}
                    src={`http://localhost:5000/${currentImage.name}`}
                  />
                </div>
              ))}
            </Carousel>
            <div className={classes.audioContainer}>
              {audio.map((current) => (
                <audio
                  className={classes.audio}
                  controls
                  src={`http://localhost:5000/${current.name}`}
                  key={current.id}
                >
                  Не поддерживаемый формат <code>audio</code>
                </audio>
              ))}
            </div>
            <div className={classes.pdfContainer}>
              {pdf.map((current, i) => (
                <a
                  key={current.id}
                  href={`http://localhost:5000/${current.name}`}
                  target="_blank"
                >
                  <div className={classes.pdf}>
                    <PdfSvg width={60} height={60} />
                    <span
                      className={`${classes.pdfName} ${fonts.g300}`}
                    >{`Pdf ${i + 1}`}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Publication;
