import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { UseCities } from "../context/CitiesContext";
// eslint-disable-next-line react/prop-types
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currCity , deleteCity} = UseCities();
  const { cityName, emoji, date, id, position } = city;
  function handleDelete(e){
    e.preventDefault()
    deleteCity(id)
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currCity.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
