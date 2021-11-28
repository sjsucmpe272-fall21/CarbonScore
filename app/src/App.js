import logo from './logo.svg';
import React, {useState, useEffect} from "react";
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import "react-awesome-button/dist/styles.css";
import Landing from './pages/Landing'
import Result from './pages/Result';
import TimeForm from './pages/TimeForm'
import Dashboard from './pages/Dashboard';
import LocationForm from './components/LocationForm';

const getMinYearAvailableForExisting = () => {
  return 2014;
}

const getMaxYearAvailableForPrediction = () => {
  return 2025;
}

function App() {
  const [process, setProcess] = useState(null);
  const [minYear, setMinYear] = useState(getMinYearAvailableForExisting());
  const [maxYear, setMaxYear] = useState(getMaxYearAvailableForPrediction());
  const [year, setYear] = useState(null);
  const [selectState, setSelectState] = useState("");
  const [selectCounty, setSelectCounty] = useState(null);

  return (
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Landing
                maxYear={maxYear}
                minYear={minYear}
                process={process}
                setMaxYear={setMaxYear} 
                setMinYear={setMinYear}
                setProcess={setProcess}
                setYear={setYear}
                selectState={selectState}
                setSelectState={setSelectState}
                selectCounty={selectCounty}
                year={year}
              />
            } 
          />
          <Route 
            path="location" 
            element={
              <LocationForm
                minYear={minYear}
                selectState={selectState}
                setSelectState={setSelectState}
                selectCounty={selectCounty}
                setSelectCounty={setSelectCounty}
                year={year}
              /> 
            } 
          />
          <Route 
            path="time" 
            element={
              <TimeForm
                maxYear={maxYear}
                minYear={minYear}
                setYear={setYear}
                year={year}
              /> 
            } 
          />
          <Route 
            path="result" 
            element={
              <Result 
                minYear={minYear} 
                process={process} 
                selectCounty={selectCounty}
                selectState={selectState}
                year={year}
              />
            } 
          />
          <Route path="dashboard" element={<Dashboard county={selectCounty}/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
