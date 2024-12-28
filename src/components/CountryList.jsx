import styles from "./CountryList.module.css";

import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  const unique = cities.filter(
    (city, index) => cities.findIndex((item) => item.country === city.country) === index
  );

  if (isLoading) return <Spinner></Spinner>;

  if (!cities.length)
    return <Message message={"Add your first city by clicking a city on a map"}></Message>;

  return (
    <ul className={styles.countryList}>
      {unique.map((country) => (
        <CountryItem country={country} key={country.id}></CountryItem>
      ))}
    </ul>
  );
}
export default CountryList;
