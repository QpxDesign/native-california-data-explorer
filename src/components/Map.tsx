import React, {useRef, useEffect, useState} from 'react';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map() {
mapboxgl.accessToken =
  "pk.eyJ1IjoicXBhdHdhcmRoYW4tb3h5IiwiYSI6ImNtMG9hdTdvZjA2bW0ybW9pOG9lMnl5ZTEifQ.qIkMeJEiiQTMx5TZM0bxOg";
    const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-119.4179);
  const [lat, setLat] = useState(36.7783);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (map?.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "",
      style: "mapbox://styles/mapbox/dark-v11",
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
  });
  });

});
  return (

    <div className="map-container" ref={mapContainer} />

  );
}
