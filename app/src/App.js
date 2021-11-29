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
                setMaxYear={setMaxYear} 
                setMinYear={setMinYear}
                setProcess={setProcess}
              />
            } 
          />
          <Route 
            path="location" 
            element={
              <LocationForm
                selectState={selectState}
                setSelectState={setSelectState}
                setSelectCounty={setSelectCounty}
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
                process={process} 
                selectCounty={selectCounty}
                selectState={selectState}
                year={year}
              />
            } 
          />
          <Route
            path="dashboard" 
            element={
              <Dashboard
                county={selectCounty}
                setYear={setYear}
                year={year}
                maxYear={maxYear}
                minYear={minYear}
                processOption={process}
                state={selectState}
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <Landing
                setMaxYear={setMaxYear} 
                setMinYear={setMinYear}
                setProcess={setProcess}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
