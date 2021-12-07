import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router';
import { backgroundStyle } from './Landing'
import Plot from 'react-plotly.js';
import {useNavigate} from 'react-router-dom';

function abbrState(input, to){
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(let i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(let i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}

const plotWrapperForExisting = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
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

const getDefaultTableData = (values, title) => {
    const data = [{
        type: 'table',
        columnorder: [1,2],
        columnwidth: [100,200],
        header: {
        values: [[`<b>${title}</b>`], ["<b>Score</b>"]],
        align: ["left", "center"],
        height: 40,
        line: {width: 1, color: '#506784'},
        fill: {color: '#1d2026'},
        font: {family: "Arial", size: 12, color: "white"}
        },
        cells: {
        values: values,
        align: ["left", "center"],
        height: 30,
        line: {color: "#506784", width: 1},
        fill: {color: ['#282c34', 'white']},
        font: {family: "Arial", size: 11, color: ["#506784"]}
        }
    }]

    return data;
}

const getDefaultMapData = () => {
    return [{
        center: [37.354107, -121.955238],
        type: "choroplethmapbox", 
        name: "US states", 
        geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json", 
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
    state,
    year,
}) {
    let location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state;
    const config = {mapboxAccessToken: process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}
    const [barChartData, setBarChartData] = useState(getDefaultBarChartData())
    const [lineChartData, setLineChartData] = useState(getDefaultLineChartData())
    const [tableData, setTableChartData] = useState(getDefaultTableData(
        [
            ['Salaries', 'Office', 'Merchandise', 'Legal', '<b>TOTAL<br>EXPENSES</b>'],
            ["Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
           "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
           "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
           "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad",
          "Lorem ipsum dolor sit amet, tollit discere inermis pri ut. Eos ea iusto timeam, an prima laboramus vim. Id usu aeterno adversarium, summo mollis timeam vel ad"]
        ],
        'City'
    ))
    const [mapData, setMapData] = useState(getDefaultMapData())

    useEffect(() => {
        if (processOption == null) {
            navigate('../', { state: {result:"abc"}, replace: false }) 
        }
        const existingCOCountyURL = "http://carbon-score.us-west-1.elasticbeanstalk.com/existing_CO_county" + 
            (county != null && county != '' ? `?county=${county}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        const existingCOScoreCitiesURL = "http://carbon-score.us-west-1.elasticbeanstalk.com/existing_CO_score_cities" + 
            (county != null && county != '' ? `?county=${county}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        const existingCOMapURL = "http://carbon-score.us-west-1.elasticbeanstalk.com/existing_state_map" + 
            (year != null && year != '' ? `?year=${year}` : '')
        
        const predictCOTableURL = "http://carbon-score-v2.us-west-1.elasticbeanstalk.com/predict_CO_table" +
            (state != null && state != '' ? `?state=${state}` : '') + 
            (county != null && county != '' ? `&county=${county}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        const predictCOPollCityURL = "http://carbon-score-v2.us-west-1.elasticbeanstalk.com/predict_CO_pollcity" +
            (state != null && state != '' ? `?state=${state}` : '') + 
            (county != null && county != '' ? `&county=${county}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        const predictCOPollMonthURL = "http://carbon-score-v2.us-west-1.elasticbeanstalk.com/predict_CO_pollmonth" +
            (state != null && state != '' ? `?state=${state}` : '') + 
            (county != null && county != '' ? `&county=${county}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        const predictCOMapURL = "http://carbon-score-v2.us-west-1.elasticbeanstalk.com/predict_CO_map" + 
            (state != null && state != '' ? `?state=${state}` : '') + 
            (county != null && county != '' ? `&county=${county}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')

        fetch(processOption === 'Existing' ? existingCOScoreCitiesURL : predictCOPollCityURL)
            .then(response => {
                response.json().then(data => {
                    const cities = processOption === 'Existing' ? data.map(city => city[0]) : data['x']
                    const scores = processOption === 'Existing' ? data.map(city => city[1]*1000) : data['y']
                    setBarChartData(
                        [{
                            x: cities,
                            y: scores,
                            type: 'bar',
                            name: 'Carbon'
                        }]
                    )
                    if (processOption === 'Existing') {
                        setTableChartData(getDefaultTableData([cities, scores], 'City'))
                    }
                })
            })
            .catch(err => console.log(err))

        fetch(processOption === 'Existing' ? existingCOCountyURL : predictCOPollMonthURL)
            .then(response => {
                response.json().then(data => {
                    setLineChartData(
                        [{
                            x: processOption === 'Existing' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : data['x'],
                            y: processOption === 'Existing' ? data.map(item => Math.floor(item * 100)) : data['y'].map(item => Math.floor(item * 1000)),
                            type: 'scatter',
                            name: 'Carbon'
                        }]
                    )
                })
            })
            .catch(err => console.log(err))

        if (processOption === 'Predict') {
            fetch(predictCOTableURL)
                .then(response => {
                    response.json().then(data => {
                        setTableChartData(getDefaultTableData([data['county'], data['carbonscore'].map((score)=>(score*1000).toString())], 'County'))
                    })
                })
                .catch(err => console.log(err))
        }

        fetch(processOption === 'Existing' ? existingCOMapURL : predictCOMapURL)
            .then(response => {
                response.json().then(data => {
                    const statesMapData = processOption === 'Existing' ? data.map((stateAndScoreTuple) => abbrState(stateAndScoreTuple[0], 'abbr')) : data['state']
                    const scoresMapData = processOption === 'Existing' ? data.map((stateAndScoreTuple) => stateAndScoreTuple[1]*1000) : data['carbonscore'].map((score) => score * 1000)
                    setMapData(
                        [{
                            center: [37.354107, -121.955238],
                            type: "choroplethmapbox", 
                            name: "US states", 
                            geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json", 
                            locations: statesMapData,
                            z: scoresMapData,
                            zmin: 25, 
                            zmax: 280, 
                            colorbar: {y: 0, yanchor: "bottom", title: {text: "US states", side: "right"}}
                        }]
                    )
                })
            })
            .catch(err => console.log(err))
      }, [])

      return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    Carbon Score Dashboard
                </p>
            </header>
            <h1>
                {year == null ? minYear : year}
                    
            </h1>
            {/* {
                processOption === 'Predict' && 
                <div>
                    <input type="range" placeholder={year} min={minYear} max={maxYear} onChange={(e) => setYear(e.target.value)} value={year}/>
                </div>
            } */}
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
                            layout={ {width: 500, height: 300, title: 'Annual Breakdown', plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                    <div class="box4" style={{ gridColumn: 3, gridRow: 2/3 }}>
                        <Plot
                            config={config}
                            data={barChartData}
                            layout={ {barmode: 'group', title: 'City Breakdown', width: 500, height: 300, plot_bgcolor:"black",paper_bgcolor:"#21242B"} }
                        />
                    </div>
                </div>
        </div>
    )
}
