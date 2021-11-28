import React, {useState, useEffect} from 'react'
import { AwesomeButton } from 'react-awesome-button';

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

const openStreetMapSearchUrl = 'https://nominatim.openstreetmap.org/search';
const fetchInit = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  
export default function LocationForm({setMyCoordinates, loadTimeData}) {
    const [address, setAddress] = useState('');
    const [selectState, setSelectState] = useState("");
    const [selectCounty, setSelectCounty] = useState("");
    const [map, setMap] = useState({});

    const getSearchUrl = (address,format,polygon,addressDetails)=>{
        format = format != null ? format : 'json';
        polygon = polygon != null ?  polygon : '1';
        addressDetails = addressDetails != null ? addressDetails : '1';
        return (openStreetMapSearchUrl + '?format='+format+'&q=' + address + '&polygon=' + polygon + '&addressdetails='+addressDetails).replace(/\s/g, '+');
    };

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
          setMap(stateCounty)
        })
      })
      .catch(err => console.log(err))
    }, [])

    /*const handleSubmit = () => {
        if (address.trim() === '') {
          return;
        }
        const addressUrl = getSearchUrl(address,null,null,null);
        try {
          fetch(addressUrl,fetchInit)
            .then(response => {
              response.json().then(data => {
                if (data == null || data[0] == null) {
                  alert("Sorry we could not find that address!");
                  return 
                }
                setMyCoordinates({lat:data[0].lat, lng:data[0].lon, displayName: data[0].display_name});
              });
            })
            .then(result => {
                loadTimeData();
              },
              error => {
                // TODO: log error
                console.log('AddressForm');
                console.log(error);
              },
            );
        } catch (err) {
          // TODO: log error
          console.log(err);
        }
      };*/

      const onAddressInputFieldChange = (e) => {
        setAddress(e.target.value);
      };

    return (

        <div>
            <div style={addressInput}> 
            <label  style={addressLabel}>States:</label>
            <select placeholder="enter state" name="states" defaultChecked={false} style={{width:"150px"}}
            onChange={(e)=> setSelectState(e.target.value)}>
              {map && (Object.keys(map)).map((item, idx) => {
                return <option key={idx} value={item}>{item}</option>
              })}
            </select>
              {/* <label for="address" style={addressLabel}>Address:</label>
              <input type="address" name="address" onChange={onAddressInputFieldChange} placeholder="1234 Maple Dr. Mushroom City, CA 12345" /> */}
            </div>
            {selectState.length > 0 && <div style={addressInput}>
              <label  style={addressLabel}>County:</label>
            <select placeholder="enter state" name="county" style={{width:"150px"}}
            onSelect={(e)=> setSelectCounty(e.target.value)}>
              <option value=""/>
              {map[selectState].map((item,idx) => {
                return <option key={idx} value={item}>{item}</option>
              })}
            </select>
            </div>}
            <AwesomeButton
              type="primary"
              onPress={loadTimeData}
            >
              Submit
            </AwesomeButton>
        </div>
      );
}
