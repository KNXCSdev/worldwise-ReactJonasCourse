import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";

const URL = "/data/cities.json";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Action unknown");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;

  useEffect(() => {
    const savedCities = localStorage.getItem("cities");
    if (savedCities) {
      dispatch({ type: "cities/loaded", payload: JSON.parse(savedCities) });
    } else {
      fetchCities();
    }
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      localStorage.setItem("cities", JSON.stringify(cities));
    }
  }, [cities]);

  async function fetchCities() {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${URL}`);
      const data = await res.json();

      dispatch({ type: "cities/loaded", payload: data.cities });
    } catch (err) {
      dispatch({ type: "rejected", payload: "There was an error loading data..." });
    }
  }

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCity.id) return;
      dispatch({ type: "loading" });

      try {
        const city = cities.find((city) => city.id === id);
        if (city) {
          dispatch({ type: "city/loaded", payload: city });
        } else {
          throw new Error("City not found");
        }
      } catch (err) {
        dispatch({ type: "rejected", payload: "There was an error loading city..." });
      }
    },
    [currentCity.id, cities]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const newCityWithId = { ...newCity, id: Date.now() };

      dispatch({ type: "city/created", payload: newCityWithId });
    } catch (err) {
      dispatch({ type: "rejected", payload: "There was an error creating a city" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      dispatch({ type: "city/deleted", payload: id });

      const updatedCities = cities.filter((city) => city.id !== id);
      localStorage.setItem("cities", JSON.stringify(updatedCities));
    } catch (err) {
      dispatch({ type: "rejected", payload: "There was an error deleting a city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, createCity, deleteCity, error }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider");

  return context;
}

export { CitiesProvider, useCities };
