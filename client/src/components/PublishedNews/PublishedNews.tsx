import classes from "./PublishedNews.module.scss";
import fonts from "@/scss/fonts.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { deleteOfferNews } from "@/http/offerNewsAPI";
import SelectPage from "../SelectPage/SelectPage";
import { MainPaths, PublicationInterfase } from "@/types/types";
import ModalNews from "../ModalNews/ModalNews";
import PublishedNewsPreview from "../PublishedNewsPreview/PublishedNewsPreview";
import { getNews } from "@/http/newsAPI";
import Loading from "../Loading/Loading";
import EmptyModal from "../EmptyModal/EmptyModal";

const PublishedNews = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const [modalInfo, setModalInfo] = useState<PublicationInterfase | any>({});
  const [theme, setTheme] = useState(MainPaths.Theater);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    getNews(page, theme)
      .then((data) => {
        setNews(data.rows);
        setCount(data.count);
      })
      .catch((e) => {})
      .finally(() => setIsPending(false));
  }, [page]);

  const handleClickNewsPreview = (modalInfo: object) => {
    setModalInfo(modalInfo);
    setShowModal(true);
  };

  const handleDeleteNews = (id: number) => {
    setNews((prev) => prev.filter((offernew) => offernew.id !== id));
  };

  const handleDeleteNewsInPreview = (id: number) => {
    deleteOfferNews(id)
      .then()
      .catch((error) => console.log(error.message));
    setNews((prev) => prev.filter((offernew) => offernew.id !== id));
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    setTheme(e.target.value);
    if (page === 1) {
      setIsPending(true);
      // @ts-ignore
      getNews(page, e.target.value)
        .then((data) => {
          setNews(data.rows);
          setCount(data.count);
        })
        .catch((e) => {})
        .finally(() => setIsPending(false));
    } else {
      setPage(1);
    }
  };

  return (
    <div className={classes.offerNewsContainer}>
      {showModal && (
        <ModalNews
          handleDeleteNews={handleDeleteNews}
          modalInfo={modalInfo}
          setShowModal={setShowModal}
        />
      )}
      {showEmptyModal && <EmptyModal setShowModal={setShowEmptyModal} />}
      <div className={classes.topContainer}>
        <select
          value={theme}
          onChange={handleSelect}
          className={`${classes.select} ${fonts.u500}`}
          name="select"
        >
          <option value={MainPaths.Theater}>Театр</option>
          <option value={MainPaths.Music}>Музыка</option>
          <option value={MainPaths.Scene}>Сцена</option>
          <option value={MainPaths.Movie}>Кино</option>
          <option value={MainPaths.Leterature}>Литература</option>
          <option value={MainPaths.Art}>ИЗО</option>
        </select>

        <button
          className={`${classes.newPublicationBtn} ${fonts.g300}`}
          onClick={() => setShowEmptyModal(true)}
        >
          + Создать публикацию
        </button>
      </div>

      <div className={classes.newsPreviewsContainer}>
        {isPending && <Loading />}
        {!isPending && news.length === 0 && (
          <span className={`${classes.infoText} ${fonts.u500}`}>
            В этой категории пока нет публикаций
          </span>
        )}
        {!isPending &&
          news.map((current) => (
            <PublishedNewsPreview
              clickFunction={() => handleClickNewsPreview(current)}
              key={current.id}
              title={current.title}
              description={current.description}
            />
          ))}
      </div>
      <div className={classes.pageNavContainer}>
        {news.length !== 0 &&
          Array.from(
            {
              length:
                count % 5 !== 0
                  ? Math.floor(count / 5) + 1
                  : Math.floor(count / 5),
            },
            (_, i) => (
              <SelectPage
                divRef={null}
                setPage={setPage}
                page={page}
                key={i}
                numPage={i + 1}
              />
            )
          )}
      </div>
    </div>
  );
};

export default PublishedNews;
