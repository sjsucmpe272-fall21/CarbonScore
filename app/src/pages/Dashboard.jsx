import React from 'react'
import { useLocation } from 'react-router';
import { backgroundStyle } from './Landing'
import Plot from 'react-plotly.js';

export default function Dashboard() {
    let location = useLocation();
    const { data } = location.state;
    const config = {mapboxAccessToken: process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}
    console.log(process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN)
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    Dashboard
                </p>
            </header>
            <Plot
                config={config}
                data={[
                    {type: "densitymapbox", lon: [10, 20, 30], lat: [15, 25, 35], z: [1, 3, 2],
                     radius: 50, colorbar: {y: 1, yanchor: 'top', len: 0.45}},
                    {type: 'densitymapbox', lon: [-10, -20, -30], lat: [15, 25, 35],
                     radius: [50, 100, 10],  colorbar: {y: 0, yanchor: 'bottom', len: 0.45}
                    }]}
                layout={ {mapbox: {style: 'light', center: {lat: 20}}, width: 600, height: 400} }
            />
            <br />
        </div>
    )
}
