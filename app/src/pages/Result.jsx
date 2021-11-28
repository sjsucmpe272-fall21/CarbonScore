import React from 'react'
import { useLocation } from 'react-router';
import { AwesomeButton } from 'react-awesome-button';
import { backgroundStyle } from './Landing'
import {useNavigate} from 'react-router-dom';

export default function Result({
    maxYear, 
    minYear, 
    process, 
    year
}) {
    let location = useLocation();
    const { data } = location.state;
    const navigate = useNavigate();
    const handleGetData = () => {
        // Call backend to get results and pass as param
        navigate('../dashboard', { state: {result:"abc"}, replace: false })
    }
    const header = year != null ? 
        (process === 'Predict' ? 'Predicted Carbon Score for the year ' + year.toString() : 'Existing Carbon Score for the year ' + year.toString()) 
        : 'Carbon Score'

    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {header}
                </p>
                <p>
                    {810}
                </p>
            </header>
            <div>
                <h2>$20000.00</h2>
                <h3>city, county, year</h3>
            </div>
            <br />
            <AwesomeButton onPress={handleGetData}>Dashboard</AwesomeButton>
        </div>
    )
}
