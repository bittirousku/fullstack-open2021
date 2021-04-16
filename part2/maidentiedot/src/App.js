import React, { useState, useEffect } from 'react'
import axios from 'axios'

const COUNTRY_URL = "http://restcountries.eu/rest/v2/all"
const WEATHER_URL = "http://api.weatherstack.com/current"


const App = () => {

  const [ searchText, setSearchText ] = useState('')
  const [ countries, setCountries ] = useState([])
  
  const getCountryData = () => {
    return axios
      .get(COUNTRY_URL)
      .then(response => setCountries(response.data))
    }
  useEffect(getCountryData, [])

  const handleSearch = (event) => {
    setSearchText(event.target.value)
  }
    
  const visibleCountries = countries.filter((country) =>
    country.name.toUpperCase().includes(searchText.toUpperCase())
  )


  return (
    <div>
      <h1>Find countries</h1>
      <input value={searchText} onChange={handleSearch}/>  
      {/* single countries are shown by setting the search text state
      which re-renders the whole component */}
      <Countries countries={visibleCountries} viewSingleCountryHandler={handleSearch} />
    </div>
  )
}

const Countries = ({countries, viewSingleCountryHandler}) => {
  if (countries.length > 10) {
    return (
      <p>Too many results!</p>
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]}/>
    )
  }
  return (
    <>
      <ul>
        {countries.map((country) => (
          <CountryListEntry
            key={country.name}
            country={country}
            viewSingleCountryHandler={viewSingleCountryHandler}
          />
        ))}
      </ul>
    </>
  )
}

const CountryListEntry = ({country, viewSingleCountryHandler}) => {
  return (
    <>
      <li>
        {country.name}{" "}
        <button value={country.name} onClick={viewSingleCountryHandler}>
          show
        </button>
      </li>
    </>
  )
}

const Country = ({country}) => {
  return (
    <>
      <h2>{country.name}</h2>

      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>

      <h3>Languages</h3>
      <ul>
        {country.languages.map(lan => <li key={lan.name}>{lan.name}</li>)}
      </ul>

      <img src={country.flag} alt="flaggy flag" width="100"/>
      <Weather city={country.capital}/>
    </>
  )
}

const Weather = ({city}) => {

  // FIXME: how to build the app if the weather functionality
  // must be in the main App level???
  const [ weather, setWeather ] = useState({})

  function getWeatherData() {
    let api_key = ""  // FIXME: remove!

    let url = `${WEATHER_URL}?access_key=${api_key}&query=${city}`
    return axios
      .get(url)
      .then(response => setWeather(response.data))
  }
  useEffect(getWeatherData, [city])
  //FIXME: why react once said:
  // `Warning: Can't perform a React state update on an unmounted component`
  // ????
  // There is something wrong with my usage of `useEffect`

  // FIXME: why is this doing the request multiple times??
  // Apparently the search is redone and the component rendered
  // after typing more matching characters of the search result
  // let weatherData = getWeatherData(city)  // don't do it like this, you won't get any results from here
  console.log(weather);
  if ("current" in weather) {
    // The weather service is crap, it gives access restriction errors randomly
    return (
      <>
        <h3>Weather in {city}</h3>
        <img src={weather.current.weather_icons[0]} alt="weather icon"/>
        <p>Temperature: {weather.current.temperature}</p>
        <p>Wind: {weather.current.wind_speed}</p>
      </>
    )
  }
  return (
    <>
        <h3>Weather in {city}</h3>
      </>
  )
}



export default App