import React, {useState, useEffect, useCallback} from 'react';
import { AwesomeButton } from 'react-awesome-button';
import {useNavigate} from 'react-router-dom';

export const backgroundStyle = {
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

export default function Landing({
    maxYear,
    minYear,
    setMaxYear,
    setMinYear,
    setProcess,
    setYear,
    selectState, 
    setSelectState,
    selectCounty, 
    year
}) {

    let navigate = useNavigate();

    const [headerContent, setHeaderContent] = useState()
    const [bodyContent, setBodyContent] = useState();

    const handleGetData = () => {
        // Call backend to get results and pass as param
        navigate('result', { state: {result:"abc"} })
    }
    
    const handleProcess = (item) => {
        setProcess(item);
        if (item === 'Existing') {
            setMaxYear(2019)
        } else if (item === 'Predict') {
            setMinYear(2022);
        }
        navigate('location', { state: {result:"abc"} })
    }
      
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {"Do you want to check a predicted future Carbon Score or an existing Score?"}
                </p>
            </header>
            <div>
                <AwesomeButton type="primary" onPress={() => {handleProcess("Predict")}}>Predict</AwesomeButton>
                &nbsp;
                &nbsp;
                <AwesomeButton onPress={() => {handleProcess("Existing")}}>Existing</AwesomeButton>
            </div>
        </div> 
    )
}
