import React, {useState} from "react";
import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";

const addressInput = {
  display: "flex",
  flexDirection: "row",
  fontSize: "calc(10px + 2vmin)",
  marginBottom:"50px",
  justifyContent: "space-between",
};

const backgroundStyle = {
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

function AddressForm({setMyCoordinates}) {
  const [address,setAddress] = useState('');

  const getSearchUrl = (address,format,polygon,addressDetails)=>{
    format = format != null ? format : 'json';
    polygon = polygon != null ?  polygon : '1';
    addressDetails = addressDetails != null ? addressDetails : '1';
    return (openStreetMapSearchUrl + '?format='+format+'&q=' + address + '&polygon=' + polygon + '&addressdetails='+addressDetails).replace(/\s/g, '+');
  };
  const onAddressInputFieldChange = (e) => {
    setAddress(e.target.value);
  };
  const handleSubmit = () => {
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
  };

  return (
    <div style={backgroundStyle}>
        <header>
	        <p>
            What county do you want to check the CarbonScore for?
	        </p>
        </header>
        <div style={addressInput}> 
          <label for="address" style={addressLabel}>Address:</label>
          <input type="address" name="address" onChange={onAddressInputFieldChange} placeholder="1234 Maple Dr. Mushroom City, CA 12345" />
        </div>
        <AwesomeButton
          type="primary"
          onPress={handleSubmit}
        >
          Submit
        </AwesomeButton>
    </div>
  );
}

export default AddressForm;
