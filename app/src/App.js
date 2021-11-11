import React, { useState, useEffect } from "react";
import LandingPage from './LandingPage';
import LocationForm from './LocationForm';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


const backgroundStyle = {
  backgroundColor: "#282c34",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "white",
  textAlign: "center",
};

function App() {
  const [process, setProcess] = useState(null);
  const [myCoordinates, setMyCoordinates] = useState({});
  console.log(myCoordinates);
  return (
    <Router>
      <div style={backgroundStyle}>
        <Switch>
        <Route path="/:id" children={<LandingPage setProcess={setProcess}/>} />
        { process != null ?
          <LocationForm setMyCoordinates={setMyCoordinates} /> :
          <LandingPage setProcess={setProcess}/>
        }
        </Switch>
      </div>
    </Router>
  );
}

export default App;
