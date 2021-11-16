import logo from './logo.svg';
import React, {useState, useEffect} from "react";
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Landing from './pages/Landing'
import Result from './pages/Result';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="result" element={<Result />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
