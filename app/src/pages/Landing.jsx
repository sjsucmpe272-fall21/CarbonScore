import React, {useState, useEffect} from 'react';
import { AwesomeButton } from 'react-awesome-button';
import LocationForm from '../components/LocationForm';
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

const LandingHeading = "Do you want to check a predicted future Carbon Score or an existing Score?";
const GatherDataHeading = "What county do you want to check the CarbonScore for?"
const TimeHeading = "What year do you want to look at?"

export default function Landing() {

    let navigate = useNavigate();

    const [headerContent, setHeaderContent] = useState()
    const [bodyContent, setBodyContent] = useState();
    const [process, setProcess] = useState(null);
    const [myCoordinates, setMyCoordinates] = useState();
    const [year, setYear] = useState(new Date().getFullYear());

    const handleGetData = () => {
        // Call backend to get results and pass as param
        navigate('result', { state: {result:"abc"} })
    }

    const loadLanding = () => {
        setHeaderContent(LandingHeading);
        setBodyContent(
            <div>
                <AwesomeButton type="primary" onPress={() => {handleProcess("Predict")}}>Predict</AwesomeButton>
                &nbsp;
                &nbsp;
                <AwesomeButton onPress={() => {handleProcess("Existing")}}>Existing</AwesomeButton>
            </div>
        );
    }

    const loadGatherData = () => {
        setHeaderContent(GatherDataHeading);
        setBodyContent(
            <LocationForm setMyCoordinates={setMyCoordinates} loadTimeData={loadTimeData}/>
        );
    }

    const loadTimeData = () => {
        setHeaderContent(TimeHeading);
        setBodyContent(
            <div>
                <input type="number" placeholder={new Date().getFullYear()} min={2000} max={3000} onChange={(e) => setYear(e.target.value)}/>
                <AwesomeButton onPress={handleGetData}> Get Data </AwesomeButton>
            </div>
        );
    }

    useEffect(() => {
        loadLanding();
    }, [])

    const handleProcess = (item) => {
        setProcess(item);
        loadGatherData();
    }
      
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {headerContent}
                </p>
            </header>
            {bodyContent}
        </div> 
    )
}
