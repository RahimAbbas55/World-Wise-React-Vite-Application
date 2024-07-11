import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from '../../../starter/components/Spinner'
import Message from '../../../starter/components/Message'
import { UseCities } from '../context/CitiesContext'
// eslint-disable-next-line react/prop-types
function CityList() {
    const { cities , isLoading} = UseCities()
    if (isLoading) return <Spinner/>

    if(!cities.length) return <Message message='Add you 1st city by clicking on map'/>
    return (
        <ul className={styles.cityList}>
            {cities.map( city => <CityItem city={city} key={city.id}/>)}
        </ul>
    )
}

export default CityList
