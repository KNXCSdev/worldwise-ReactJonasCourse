import Twemoji from "react-twemoji";
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <Twemoji className={styles.Twemoji}>{country.emoji}</Twemoji>
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
