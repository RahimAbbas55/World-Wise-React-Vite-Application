import { createContext, useContext, useEffect, useReducer, useState } from "react";
const BASE_URL = "http://localhost:9000";
const CitiesContext = createContext();

const initailState = {
  cities: [],
  isLoading: false,
  currCity: {},
  error: ''
}

function reducer(state , action) { 
  switch(action.type){

    case 'loading':{
      return { 
        ...state , isLoading: true
      }
    }

    case 'cities/loaded':{
      return {
        ...state , isLoading: false , cities: action.payload
      }
    }

    case 'city/loaded':{
      return {
        ...state , isLoading: false , currCity: action.payload
      }
    }

    case 'city/created':{
      return {
        ...state , isLoading: false , cities: [...state.cities , action.payload] , currCity:action.payload
      }
    }
    case 'city/deleted':{
      return {
        ...state , isLoading: false , cities: state.cities.filter(city => city.id !== action.payload) , currCity: {}
      }
    }
    case 'rejected':{
      return{
        ...state , isLoading: false , error: action.payload
      }
    }
    default:{
      throw new Error('Action unidentified!')
    }
  }
}

function CitiesProvider({ children }) {
  const [ {cities , isLoading , currCity , error} , dispatch ] = useReducer(reducer , initailState)
  useEffect(function () {
    async function fetchCities() {
      dispatch({type: 'loading'})
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: 'cities/loaded' , payload: data})
      } catch (error) {
        dispatch({type: 'rejected' , payload: '"Error loading data"'});
      }
    }
    fetchCities();
  }, []);

  async function GetCity( id ){
    if ( Number(id) === currCity.id ) return
    dispatch({type: 'loading'})
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({type: 'city/loaded' , payload: data})
      
    } catch (error) {
      alert("Error loading data");
    }
  }

  async function createCity( newCity ){
    dispatch({type: 'loading'})
    try {
      const res = await fetch(`${BASE_URL}/cities` , {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type' : 'application/json'
        } 
      });
      const data = await res.json();
      dispatch({type: 'city/created' , payload: data})
    } catch (error) {
      dispatch({type: 'rejected' , payload: "Error creating city!"});
    } 
  }

  async function deleteCity( id ){
    dispatch({type: 'loading'})
    try {
      await fetch(`${BASE_URL}/cities/${id}` , {
        method: "DELETE",
      });
      dispatch({type: 'city/deleted' , payload: id})
    } catch (error) {
      dispatch({type: 'rejected' , payload: "Error deleting city!"});
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        error,
        GetCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function UseCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context is being used outside of the components");
  return context;
}

export { CitiesProvider, UseCities };
