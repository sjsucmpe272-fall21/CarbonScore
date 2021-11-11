import React, { useState, useEffect } from "react";
import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import {
  useParams
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

const PROXY_URL = process.env.REACT_APP_API_SERVER_HOST;

function LandingPage({setProcess}) {
  const { id } = useParams();
  return (
    <div style={backgroundStyle}>
      <header>
        <p>
          Do you want to check a predicted future Carbon Score or an existing Score?
        </p>
      </header>
      <AwesomeButton
        type="primary"
        onPress={() => { setProcess('Predict'); }}
        style={{ marginBottom:"50px" }}
      >
        Predict
      </AwesomeButton>
      <AwesomeButton
        type="primary"
        onPress={()=> { setProcess('Existing'); }}
      >
        Existing
      </AwesomeButton>
    </div>
  );
}

export default LandingPage;