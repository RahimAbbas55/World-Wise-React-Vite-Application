// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { UseCities } from "../context/CitiesContext";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji , setEmoji] = useState("")
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [geocodeError , setGeocodeError] = useState("")
  const [lat, lng] = useUrlPosition();
  const { createCity , isLoading } = UseCities()

  useEffect(
    function () {
      if (!lat && !lng) return 
      async function fetchCityData() {
        try {
          setIsLoadingGeoCoding(true);
          setGeocodeError('')
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if ( !data.countryCode ) {
            throw new Error('Not a viable place!')
          }

          setCityName(data.cityName || data.locality || "");
          setCountry(data.countryName)
          setEmoji(convertToEmoji(data.countryCode))
        } catch (error) {
          setGeocodeError(error.message)
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function HandleSubmit(e){
    e.preventDefault()
    if ( !cityName || !date ) return
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {lat , lng} 
    }
    await createCity(newCity)
    navigate('/app/cities')
  }

  if ( isLoadingGeoCoding ) return <Spinner/>

  if (!lat && !lng) return <Message message="Start by clicking somewher on the map!"/>

  if( geocodeError ) return <Message message={geocodeError}/>

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={HandleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id='date' onChange={(date) => setDate(date)} selected={date} dateFormat='dd/MM/yyyy'/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
