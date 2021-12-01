import React, {useState, useEffect} from 'react'
import { AwesomeButton } from 'react-awesome-button';
import {useNavigate} from 'react-router-dom';
import { backgroundStyle } from '../pages/Landing'

const DEFAULT_STATE = 'California';

const addressInput = {
    display: "flex",
    flexDirection: "row",
    fontSize: "calc(5px + 2vmin)",
    font:"AvenirNext-Bold",
    marginBottom:"50px",
    justifyContent: "space-between",
  };
  
  const addressLabel = {
    marginRight: "10px",
  };
  
export default function LocationForm({
  selectState,
  setSelectCounty,
  setSelectState,
}) {
  
  const [map, setMap] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    fetch( "http://carbon-score.us-west-1.elasticbeanstalk.com/counties")
    .then(response => {
      response.json().then(data => {
        const stateCounty = {};
        data.map(item => {
          const arr = String(item).split(', ');
          const county = arr[0];
          const state = arr[1];
          stateCounty[state] = stateCounty[state] || [];
          stateCounty[state].push(county);
        })
        setSelectState(DEFAULT_STATE);
        setSelectCounty(stateCounty[DEFAULT_STATE][0]);
        setMap(stateCounty)
      })
    })
    .catch(err => console.log(err))
  }, [])

    return (
      <div style={backgroundStyle}>
          <header>
              <p>
                  {"Please select the State/County for which you want to check the Carbon Score"}
              </p>
          </header>
          <div>
              <div style={addressInput}> 
              <label  style={addressLabel}>States:</label>
              <select 
                placeholder="enter state" 
                name="states" 
                defaultChecked={false} 
                style={{width:"150px"}}
                onChange={(e)=> setSelectState(e.target.value)}
                value={selectState}
              >
                {map != null && (Object.keys(map)).map((item, idx) => {
                  return <option key={`state_${idx}`} value={item}>{item}</option>
                })}
              </select>
                {}
              </div>
              {
                <div style={addressInput}>
                  <label  style={addressLabel}>County:</label>
                  <select 
                    placeholder="enter county" 
                    name="counties" 
                    style={{width:"150px"}}
                    onChange={(e)=> setSelectCounty(e.target.value)}
                  >
                    {map != null && map[selectState] != null && map[selectState].map((item,idx) => {
                      return <option key={`county_${idx}`} value={item}>{item}</option>
                    })}
                  </select>
                </div>
              }
              <AwesomeButton
                type="primary"
                onPress={() => { navigate('../time', { state: {result:"abc"}, replace: false }) }}
              >
                Submit
              </AwesomeButton>
          </div>
      </div> 
    );
}
