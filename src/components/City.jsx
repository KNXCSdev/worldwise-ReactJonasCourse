import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import Twemoji from "react-twemoji";
import Button from "./Button";
import { useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function City() {
  const { id } = useParams();
  const navigate = useNavigate(); // TO navigate -1 after clicking back button
  const { getCity, currentCity, isLoading } = useCities();
  console.log(currentCity);

  useEffect(
    function () {
      getCity(id);
    },
    [id]
  );

  // TEMP DATA

  const { cityName, emoji, date, notes } = currentCity;

  if (isLoading) return <Spinner></Spinner>;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>
            <Twemoji className={styles.Twemoji}>{emoji}</Twemoji>
          </span>
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a href={`https://en.wikipedia.org/wiki/${cityName}`} target="_blank" rel="noreferrer">
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <Button
          type="back"
          onClick={() => {
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </div>
  );
}

export default City;
