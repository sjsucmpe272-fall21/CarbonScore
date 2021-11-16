import React from 'react'
import { useLocation } from 'react-router';
import { backgroundStyle } from './Landing'

export default function Result() {
    let location = useLocation();
    const { data } = location.state;
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
        </div>
    )
}
