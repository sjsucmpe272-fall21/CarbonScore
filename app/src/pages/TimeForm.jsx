import React, {useState, useEffect} from 'react'
import { AwesomeButton } from 'react-awesome-button';
import {useNavigate} from 'react-router-dom';
import { backgroundStyle } from '../pages/Landing'

const addressInput = {
    display: "flex",
    flexDirection: "row",
    fontSize: "calc(5px + 2vmin)",
    font:"AvenirNext-Bold",
    marginBottom:"50px",
    justifyContent: "space-between",
  };
  
  const addressLabel = {
    marginRight: "10px",
  };

export default function LocationForm({
  minYear,
  maxYear,
  process,
  setYear,
  year, 
}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (process == null) {
            navigate('../', { state: {result:"abc"}, replace: false }) 
        }
    }, []);
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {"Please select the year for which you want to check the Carbon Score"}
                </p>
            </header>
            <h1>
                {year == null ? minYear : year}
            </h1>
            <div>
                <input type="range" placeholder={year} min={minYear} max={maxYear} onChange={(e) => setYear(e.target.value)}/>
                <br />
                <br />
                <AwesomeButton onPress={() => { setYear(minYear); navigate('../result', { state: {year},replace: false }) }}> Get Data </AwesomeButton>
            </div>
        </div> 
    );
}
