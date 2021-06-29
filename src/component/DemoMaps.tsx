import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import icon from "./icon";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { Button } from '@material-ui/core';
import taxiIcon from "./taxiIcon";

const LocationMarker = (bbox: any, setBbox: any ) => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      if(bbox.bbox.lat === 0 && bbox.bbox.lng === 0 ){
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom())
        // map.panTo(e.latlng );
        L.circle(e.latlng, 30).addTo(map);
      }else{

        setPosition(bbox.bbox);
        map.flyTo(e.latlng, map.getZoom())
        // map.panTo(bbox.bbox);
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
  console.log('comih here')
  useEffect(() => {
    map.locate().on("locationfound", function (e) {

      setPosition(mark.mark);
      map.flyTo(mark.mark, map.getZoom())
      // map.panTo(mark.mark);
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
const Search = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({

      provider: provider,
      marker: {
        icon
      }
    });

    map.addControl(searchControl);
    return () => { map.removeControl(searchControl); }
  }, []);

  return null;
}




const LeafletMap = () => {

  const [place, setPlace] = useState('');
  const [bbox, setBbox] = useState({lat: 0, lng: 0});
  const [taxiMark, setTaxiMark] = useState([1.285194, 103.8522982]);

  const [taxiList, setTaxiList] = useState([]);



  const getTaxiList = async (p: any) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://qa-interview-test.splytech.dev/api/drivers?latitude='+p.lat+'&longitude='+p.lng,

    );
    if (response.status === 200) {
      // let list = [];
      const content = await response.json();

      setTaxiList(content.drivers);
    }
  };

  return (
    <div>
      <Button color="primary" onClick={() => { setBbox({lat: 0 as any, lng :0 as any}); setPlace('Nearest');   }}>Nearest</Button>
      <Button color="primary" onClick={() => { setBbox({lat: 51.5049375 as any, lng :-0.0964509 as any}); setPlace('London'); getTaxiList({lat: 51.5049375 as any, lng :-0.0964509 as any}) }}>London</Button>
      <Button color="secondary" onClick={() => { setBbox({lat: 1.285194 as any, lng :103.8522982 as any}); setPlace('Singapore'); getTaxiList({lat: 1.285194 as any, lng :103.8522982 as any}) }}>Singapore</Button> 


      <MapContainer center={[16.6068, 49.1951]} zoom={15}
        style={{ height: "100vh" }} scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

{console.log(place)}
        <LocationMarker bbox={bbox} setBbox={setBbox}  />

        {place === 'Nearest' &&
          <LocationMarker bbox={bbox} setBbox={setBbox}  />
        }
        {place === 'London' &&
          <LocationMarker bbox={bbox} setBbox={setBbox}  />
        }
        {place === 'Singapore' &&
          <LocationMarker bbox={bbox} setBbox={setBbox}  />
        }
        {place === 'London' &&
          taxiList.map((key: any) =>(
            <TaxiMarker mark={{lat: key.location.latitude, lng: key.location.longitude}} />
             ))
        }
        {place === 'Singapore' &&
          taxiList.map((key: any) =>(
            <TaxiMarker  mark={{lat: key.location.latitude, lng: key.location.longitude}} />
             ))
        }
        <Search />
      </MapContainer>
    </div>
  )
}

export default LeafletMap;