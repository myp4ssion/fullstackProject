import { useEffect, useState } from "react";
import classes from "./OfferNews.module.scss";
import fonts from "@/scss/fonts.module.scss";
import { deleteOfferNews, getOfferNews } from "@/http/offerNewsAPI";
import NewsPreview from "../NewsPreview/NewsPreview";
import SelectPage from "../SelectPage/SelectPage";
import ModalOfferNews from "../ModalOfferNews/ModalOfferNews";
import { OfferNewsInterfase } from "@/types/types";
import Loading from "../Loading/Loading";

const OfferNews = () => {
  const [offerNews, setOfferNews] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState<OfferNewsInterfase | any>({});
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    getOfferNews(page)
      .then((data) => {
        setOfferNews(data.rows);
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
    setOfferNews((prev) => prev.filter((offernew) => offernew.id !== id));
  };

  const handleDeleteNewsInPreview = (id: number) => {
    deleteOfferNews(id)
      .then()
      .catch((error) => console.log(error.message));
    setOfferNews((prev) => prev.filter((offernew) => offernew.id !== id));
  };

  return (
    <div className={classes.offerNewsContainer}>
      {showModal && (
        <ModalOfferNews
          handleDeleteNews={handleDeleteNews}
          modalInfo={modalInfo}
          setShowModal={setShowModal}
        />
      )}
      <div className={classes.newsPreviewsContainer}>
        {isPending && <Loading />}
        {!isPending && offerNews.length === 0 && (
          <span className={`${classes.infoText} ${fonts.u500}`}>
            Предложенных публикаций пока нет
          </span>
        )}
        {!isPending &&
          offerNews.map((current) => (
            <NewsPreview
              handleDeleteNews={() => handleDeleteNewsInPreview(current.id)}
              clickFunction={() => handleClickNewsPreview(current)}
              key={current.id}
              title={current.title}
              description={current.description}
            />
          ))}
      </div>
      <div className={classes.pageNavContainer}>
        {offerNews.length !== 0 &&
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

export default OfferNews;
