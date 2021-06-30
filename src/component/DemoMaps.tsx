import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { Button } from '@material-ui/core';
import taxiIcon from "./taxiIcon";
import London from './London';
import Singapore from './Singapore';
import Nearest from './Nearest';




const DemoMaps = () => {

  const [place, setPlace] = useState('Nearest');
  const [bbox, setBbox] = useState({});

  const getCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(function (position) {
      setBbox({ lat: position.coords.latitude, lng: position.coords.longitude })
    });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setBbox({ lat: position.coords.latitude, lng: position.coords.longitude })
    });
  }, [bbox, setBbox]);


  const clickButton = (p: any) => {
    setPlace(p);
  }


  return (
    <div>
      <Button onClick={() => { clickButton('Nearest'); }}>Nearest</Button>
      <Button color="primary" onClick={() => { clickButton('London'); }}>London</Button>
      <Button color="secondary" onClick={() => { clickButton('Singapore'); }}>Singapore</Button>


      {
        place === 'Nearest' && Object.keys(bbox).length !== 0 && <Nearest box={bbox} />
      }
      {
        place === 'London' && <London />
      }
      {
        place === 'Singapore' && <Singapore />
      }

    </div>
  )
}

export default DemoMaps;