import React, {useRef, useEffect, useState} from 'react';
import './App.css';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
mapboxgl.accessToken =
  "pk.eyJ1IjoicXBhdHdhcmRoYW4tb3h5IiwiYSI6ImNtMG43MnhsbTAwaWMyam9rd2o3aHE4amQifQ.UIjCbHbgQ80yyhl_Do6lIg";
    const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-119.4179);
  const [lat, setLat] = useState(36.7783);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (map?.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "",
      style: "mapbox://styles/qpatwardhan-oxy/cm0n74650020y01qv0lvs2ae0",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    map.current.addControl(new mapboxgl.NavigationControl());
      map?.current?.on('load', function () {
  map?.current?.getStyle()?.layers.map(function (layer) {
        if (layer.type === 'symbol') {
        map?.current?.setLayoutProperty(layer.id, 'visibility', 'none');
    }
    if (layer.id.indexOf('road') >= 0) {
      map?.current?.setLayoutProperty(layer.id, 'visibility', 'none');
    }
        map?.current?.addLayer(
        {
          id: 'qpatwardhan-oxy.9wdqut7m',
          type: 'fill',
          source: 'urban-areas',
          layout: {},
          paint: {
            'fill-color': '#f08',
            'fill-opacity': 0.4
          }
        },

      );
  });
  });

});
  return (
    <div className="App">
    <div className="map-container" ref={mapContainer} />
    </div>
  );
}

export default App;
