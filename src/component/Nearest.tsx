import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import icon from "./icon";
import taxiIcon from "./taxiIcon";
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    //marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);




const LocationMarker = (bbox: any, setBbox: any) => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {

      if (bbox.bbox.lat === 0 && bbox.bbox.lng === 0) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom())
        L.circle(e.latlng, 30).addTo(map);
      } else {

        setPosition(bbox.bbox);
        map.flyTo(e.latlng, map.getZoom())
        L.circle(bbox.bbox, 30).addTo(map);
      }
    });
  }, [map, setBbox]);



  if (!bbox || !position) return null;
  return (

    <Marker position={position} icon={icon}>
      <Popup>
        You are here. <br />
        Map bbox: <br />
      </Popup>
    </Marker>

  );
}

const TaxiMarker = (mark: any, setMark: any) => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {

      setPosition(mark.mark);
      map.flyTo(mark.mark, map.getZoom())
      L.circle(mark.mark).addTo(map);
    });
  }, [map, setMark]);

  if (!mark || !position) return null;
  return (

    <Marker position={position} icon={taxiIcon}>
      <Popup>
        Taxi here <br />
      </Popup>
    </Marker>

  );
}



const Nearest = (box: any) => {

  const [place, setPlace] = useState('');
  const [bbox, setBbox] = useState({ lat: 0, lng: 0 });

  const [taxiList, setTaxiList] = useState([]);

  const getTaxiList = async () => {
    const response = await fetch('/api/drivers?latitude=' + box.box.lat + '&longitude=' + box.box.lng);
    if (response.status === 200) {
      const content = await response.json();

      setTaxiList(content.drivers);
    }
  };

  const taxiSlider = async (value: any) => {
    const response = await fetch('/api/drivers?latitude=' + box.box.lat + '&longitude=' + box.box.lng + '&count=' + value);
    if (response.status === 200) {
      const content = await response.json();

      setTaxiList(content.drivers);
    }
  };


  useEffect(() => {
    getTaxiList();
  }, []);

  const [slideValue, setSlideValue] = useState(0);
  let minValue = 0;
  let maxValue = 10;
  let step = 1

  const handleSliderChange = (event: any, value: any) => {
    setSlideValue(value);
    taxiSlider(value);

  }

  return (
    <div>
      <div style={{ width: '70%', textAlign: 'center', paddingRight: '15%', paddingLeft: '15%', }}>
        <PrettoSlider
          onChange={handleSliderChange}
          aria-label="pretto slider"
          min={minValue}
          step={step}
          max={maxValue}
        />
      </div>

      <MapContainer center={[16.6068, 49.1951]} zoom={15}
        style={{ height: "100vh" }} scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker bbox={bbox} setBbox={setBbox} />
        {
          taxiList.map((key: any) => (
            <TaxiMarker mark={{ lat: key.location.latitude, lng: key.location.longitude }} />
          ))
        }

      </MapContainer>
    </div>
  )
}

export default Nearest;