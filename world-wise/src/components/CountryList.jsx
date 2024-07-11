import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import Spinner from './Spinner'
import Message from './Message'
import { UseCities } from '../context/CitiesContext'
// eslint-disable-next-line react/prop-types
function CityList() {
    const { cities , isLoading }  = UseCities()
    if (isLoading) return <Spinner/>
    if(!cities.length) return <Message message='Add you 1st country by clicking on map'/>
    const countries = cities.reduce((arr , city) =>{
        if ( !arr.map( el => el.country ).includes(city.country) )
            return [...arr , { country: city.country , emoji: city.emoji}]
        else
            return arr
    }, [])
    console.log(countries)
    return (
        <ul className={styles.countryList}>
            {countries.map( country => <CountryItem country={country} key={country.country}/>)}
        </ul>
    )
}

export default CityList
