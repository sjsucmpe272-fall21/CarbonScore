import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router';
import { backgroundStyle } from './Landing'
import Plot from 'react-plotly.js';

const plotWrapperForExisting = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gridAutoRows: 300,
    gridAutoFlow: 'column',
    gap: 20,
};

const plotWrapperForPredict = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gridAutoRows: 300,
    gridAutoFlow: 'column',
    gap: 20,
};

const getDefaultBarChartData = () => {
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

const getDefaultLineChartData = () => {
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

const getDefaultTableData = () => {
    const values = [
        ['Salaries', 'Office', 'Merchandise', 'Legal', '<b>TOTAL<br>EXPENSES</b>'],
        ["Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
       "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
       "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
       "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
      "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad"]
    ]
  
    const data = [{
        type: 'table',
        columnorder: [1,2],
        columnwidth: [100,200],
        header: {
        values: [["<b>EXPENSES</b><br>as of July 2017"], ["<b>DESCRIPTION</b>"]],
        align: ["left", "center"],
        height: 40,
        line: {width: 1, color: '#506784'},
        fill: {color: '#119DFF'},
        font: {family: "Arial", size: 12, color: "white"}
        },
        cells: {
        values: values,
        align: ["left", "center"],
        height: 30,
        line: {color: "#506784", width: 1},
        fill: {color: ['#25FEFD', 'white']},
        font: {family: "Arial", size: 11, color: ["#506784"]}
        }
    }]

    return data;
}

const getDefaultMapData = (county) => {
    const geoJSONURL = county != null && county != ''
        ? "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us_counties_20m_topo.json"
        : "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
    return [{
        center: [37.354107, -121.955238],
        type: "choroplethmapbox", 
        name: "US states", 
        geojson: geoJSONURL, 
        locations: [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ],
        z: [ 141, 140, 155, 147, 132, 146, 151, 137, 146, 136, 145, 141, 149, 151, 138, 158, 164, 141, 146, 145, 142, 150, 155, 160, 156, 161, 147, 164, 150, 152, 155, 167, 145, 146, 151, 154, 161, 145, 155, 150, 151, 162, 172, 169, 170, 151, 152, 173, 160, 176 ],
        zmin: 25, 
        zmax: 280, 
        colorbar: {y: 0, yanchor: "bottom", title: {text: "US states", side: "right"}}
    }]
};


export default function Dashboard({
    county,
    maxYear,
    minYear,
    processOption,
    setYear,
    year,
}) {
    let location = useLocation();
    const { data } = location.state;
    const config = {mapboxAccessToken: process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}
    const [barChartData, setBarChartData] = useState(getDefaultBarChartData())
    const [lineChartData, setLineChartData] = useState(getDefaultLineChartData())
    const [tableData, setTableChartData] = useState(getDefaultTableData())
    const [mapData, setMapData] = useState(getDefaultMapData(county))

    useEffect(() => {
        fetch("http://carbon-score.us-west-1.elasticbeanstalk.com/barChartData" + (county != null && county != '' ? `?county=${county}` : ''))
        .then(response => {
          response.json().then(data => {
            setBarChartData(data)
          })
        })
        .catch(err => console.log(err))

        fetch("http://carbon-score.us-west-1.elasticbeanstalk.com/lineChartData" + (county != null && county != '' ? `?county=${county}` : ''))
        .then(response => {
          response.json().then(data => {
            setLineChartData(data)
          })
        })
        .catch(err => console.log(err))

        fetch("http://carbon-score.us-west-1.elasticbeanstalk.com/tableChartData" + (county != null && county != '' ? `?county=${county}` : ''))
        .then(response => {
          response.json().then(data => {
            setTableChartData(data)
          })
        })
        .catch(err => console.log(err))

        fetch("http://carbon-score.us-west-1.elasticbeanstalk.com/mapData" + (county != null && county != '' ? `?county=${county}` : ''))
        .then(response => {
          response.json().then(data => {
            setMapData(data)
          })
        })
        .catch(err => console.log(err))
      }, [])
      console.log(process)
      return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    Dashboard
                </p>
            </header>
            <h1>
                {year == null ? minYear : year}
                    
            </h1>
            {
                processOption === 'Existing' && 
                <div>
                    <input type="range" placeholder={year} min={minYear} max={maxYear} onChange={(e) => setYear(e.target.value)} value={year}/>
                </div>
            }
            {
                processOption === 'Existing' && 
                <div class="plot-wrapper" style={plotWrapperForExisting}>
                    <div class="box1" style={{ gridColumn: 1, gridRow: 1 }}>
                        <Plot
                            config={config}
                            data={tableData}
                            layout={ {width: 400, height: 620, plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                    <div class="box2" style={{ gridColumn: 2, gridRow: 1 }}>
                        <Plot
                            config={config}
                            data={mapData}
                            layout={ 
                                { 
                                mapbox: 
                                    { style: "dark", center: {lon: -110, lat: 50}, zoom: 0.8}, width: 600, height: 620, margin: {t: 0, b: 0},
                                plot_bgcolor:"black",paper_bgcolor:"#21242B"
                                } 
                            }
                        />
                    </div>
                    <div class="box3" style={{ gridColumn: 3, gridRow: 1/3 }}>
                        <Plot
                            config={config}
                            data={lineChartData}
                            layout={ {width: 500, height: 300, plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                    <div class="box4" style={{ gridColumn: 3, gridRow: 2/3 }}>
                        <Plot
                            config={config}
                            data={barChartData}
                            layout={ {barmode: 'group', title: 'Annual Breakdown', width: 500, height: 300, plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                </div>
            }
            {
                processOption === 'Predict' && 
                <div class="plot-wrapper" style={plotWrapperForPredict}>
                    <div class="box1" style={{ gridColumn: 1, gridRow: 1 }}>
                        <Plot
                            config={config}
                            data={mapData}
                            layout={ 
                                { 
                                mapbox: 
                                    { style: "dark", center: {lon: -110, lat: 50}, zoom: 0.8}, width: 600, height: 620, margin: {t: 0, b: 0},
                                plot_bgcolor:"black",paper_bgcolor:"#21242B"
                                } 
                            }
                        />
                    </div>
                    <div class="box2" style={{ gridColumn: 2, gridRow: 1/3 }}>
                        <Plot
                            config={config}
                            data={lineChartData}
                            layout={ {width: 500, height: 300, plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                    <div class="box3" style={{ gridColumn: 2, gridRow: 2/3 }}>
                        <Plot
                            config={config}
                            data={barChartData}
                            layout={ {barmode: 'group', title: 'Annual Breakdown', width: 500, height: 300, plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                </div>
            }
        </div>
    )
}
