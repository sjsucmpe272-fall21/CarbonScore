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
const GatherDataHeading = "Please select the State/County for which you want to check the Carbon Score"
const TimeHeading = "What year do you want to look at?"

const getMinYearAvailableForExisting = () => {
    return 2014;
}

const getMaxYearAvailableForPrediction = () => {
    return 2040;
}


export default function Landing() {

    let navigate = useNavigate();

    const [headerContent, setHeaderContent] = useState()
    const [bodyContent, setBodyContent] = useState();
    const [process, setProcess] = useState(null);
    const [myCoordinates, setMyCoordinates] = useState();
    const [year, setYear] = useState();
    const [minYear, setMinYear] = useState(getMinYearAvailableForExisting());
    const [maxYear, setMaxYear] = useState(getMaxYearAvailableForPrediction());

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
        setHeaderContent(TimeHeading)
        setBodyContent(
            <div>
                <input type="range" placeholder={year} min={minYear} max={maxYear} onChange={(e) => setYear(e.target.value)}/>
                <br />
                <br />
                <AwesomeButton onPress={handleGetData}> Get Data </AwesomeButton>
            </div>
        );
    }

    useEffect(() => {
        loadLanding();
    }, [])

    const handleProcess = (item) => {
        setProcess(item);
        if (item === 'Existing') {
            setMaxYear(2019)
        } else if (item === 'Predict') {
            setMinYear(2022);
        }
        loadGatherData();
    }

    useEffect(() => {
        if (year != null) {
            loadTimeData();
        }
    }, [year]);
      
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {headerContent}
                </p>
            </header>
            { headerContent === TimeHeading &&
                <h1>
                    {year == null ? minYear : year}
                </h1>
            }
            {bodyContent}
        </div> 
    )
}
