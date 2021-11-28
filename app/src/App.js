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
import Dashboard from './pages/Dashboard';

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
  const [year, setYear] = useState();

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
                year={year}
              />
            } 
          />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
