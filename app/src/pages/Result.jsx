import React from 'react'
import { useLocation } from 'react-router';
import { AwesomeButton } from 'react-awesome-button';
import { backgroundStyle } from './Landing'
import {useNavigate} from 'react-router-dom';

export default function Result() {
    let location = useLocation();
    const { data } = location.state;
    const navigate = useNavigate();
    const handleGetData = () => {
        // Call backend to get results and pass as param
        navigate('../dashboard', { state: {result:"abc"}, replace: false })
    }
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    Carbon Score
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
