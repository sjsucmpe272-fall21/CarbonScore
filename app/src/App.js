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

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="result" element={<Result />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
