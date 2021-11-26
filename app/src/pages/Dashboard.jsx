import React from 'react'
import { useLocation } from 'react-router';
import { backgroundStyle } from './Landing'
import Plot from 'react-plotly.js';

const plotWrapper = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gridAutoRows: 300,
    gridAutoFlow: 'column',
    gap: 20,
};

const box1 = {
    gridColumn: 1,
    gridRow: 1
};

const box2 = {
    gridColumn: 2,
    gridRow: 1/3
};

const box3 = {
    gridColumn: 2,
    gridRow: 2/3
};

const getBarChartData = () => {
    const barChartTrace1 = {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // months
        y: [20, 14, 23,20, 14, 23,20, 14, 23, 12, 14,2], // concentration values (number/float)
        name: 'Carbon', // plutant name
        type: 'bar'
    };
    const barChartTrace2 = {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: [20, 14, 23,20, 14, 23,16, 5, 11, 9, 14,2], 
        name: 'Nitrogen',
        type: 'bar'
    };
    return [barChartTrace1, barChartTrace2]
}

const getLineChartData = () => {
    const lineChartTrace1 = {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: [2, 14, 12,20, 15, 23,16, 5, 11, 9, 14,2], // concentration
        type: 'scatter',
        name: 'Carbon'
    };
    const lineChartTrace2 = {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: [20, 14, 23,20, 14, 23,20, 14, 23, 12, 14,2], // concentration
        type: 'scatter',
        name: 'Nitrogen'
    };
    return [lineChartTrace1, lineChartTrace2]
}


export default function Dashboard() {
    let location = useLocation();
    const { data } = location.state;
    const config = {mapboxAccessToken: process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}
                  
    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    Dashboard
                </p>
            </header>
            <div class="plot-wrapper" style={plotWrapper}>
                <div class="box1" style={box1}>
                    <Plot
                        config={config}
                        data={
                            [{
                                type: "choroplethmapbox", name: "US states", geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json", locations: [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ],
                            z: [ 141, 140, 155, 147, 132, 146, 151, 137, 146, 136, 145, 141, 149, 151, 138, 158, 164, 141, 146, 145, 142, 150, 155, 160, 156, 161, 147, 164, 150, 152, 155, 167, 145, 146, 151, 154, 161, 145, 155, 150, 151, 162, 172, 169, 170, 151, 152, 173, 160, 176 ],
                            zmin: 25, zmax: 280, colorbar: {y: 0, yanchor: "bottom", title: {text: "US states", side: "right"}}
                            }]
                        }
                        layout={ {mapbox: {style: "dark", center: {lon: -110, lat: 50}, zoom: 0.8}, width: 700, height: 620, margin: {t: 0, b: 0}} }
                    />
                </div>
                <div class="box2" style={box2}>
                    <Plot
                        config={config}
                        data={getLineChartData()}
                        layout={ {width: 500, height: 300} }
                    />
                </div>
                <div class="box4" style={box3}>
                    <Plot
                        config={config}
                        data={getBarChartData()}
                        layout={ {barmode: 'group', title: 'Annual Breakdown', width: 500, height: 300} }
                    />
                </div>
            </div>
        </div>
    )
}
