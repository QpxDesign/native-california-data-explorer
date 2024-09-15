import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector, useDispatch } from "react-redux";
import { navigateTo } from "../store/map";
import { RootState } from "../store/store";
import MapData from "../assets/MapData.json";
import { MapItem } from "../structs/MapItem";
import { GenerateMarker } from "./map/marker";
import { GetGemoetryFromFile } from "./map/shape";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Polygon } from "react-native-maps";
import { ShapeGeometry } from "./map/shape";
import Position from "mapbox-gl";
import { Generate3DModel } from "./map/three-d";


type Marker = {
  id: string,
  marker: mapboxgl.Marker
}

export default function Map() {
  const map_pos = useSelector((state: RootState) => state.map.value);
  const tyear = useSelector((state: RootState) => state.timeline.value);
  const [year, setYear] = useState(1590);
  const [markers, setMarkers] = useState<Array<Marker>>([]);
  const [mapids, setMapids] = useState<Array<String>>([]);
  const DEFAULT_MAP_LOCATION = [36.7783, -119.4179, 5];
  const dispatch = useDispatch();
  mapboxgl.accessToken =
    "pk.eyJ1IjoicXBhdHdhcmRoYW4tb3h5IiwiYSI6ImNtMG9hdTdvZjA2bW0ybW9pOG9lMnl5ZTEifQ.qIkMeJEiiQTMx5TZM0bxOg";
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    setYear(tyear);
  },[tyear])
  useEffect(() => {
    console.log(map_pos);
    if (map_pos === undefined) {
      return;
    }
    if (
      map_pos[0] === undefined ||
      map_pos[1] === undefined ||
      map_pos[2] === undefined
    ) {
      return;
    }
    const dest = {
      center: [map_pos[1], map_pos[0]],
      zoom: map_pos[2],
      bearing: 130,
      pitch: 75,
    };
    map.current?.flyTo({
      duration: 2500,
      essential: false,
      zoom: map_pos[2],
      center: [map_pos[1], map_pos[0]],
    });
  }, [map_pos]);

  useEffect(() => {
    if (map?.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "",
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [DEFAULT_MAP_LOCATION[1], DEFAULT_MAP_LOCATION[0]], //
      zoom: DEFAULT_MAP_LOCATION[2],
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

    map?.current?.on("load", function () {
      map?.current?.getStyle()?.layers.map(function (layer) {
        if (layer.type === "symbol") {
          map?.current?.setLayoutProperty(layer.id, "visibility", "none");
        }
        if (layer.id.indexOf("road") >= 0) {
          map?.current?.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
    });
  });
  useEffect(() => {
    if (map === null || map.current === null) return;
    if (map.current.loaded() === false) return;
        MapData.forEach((p: MapItem) => {
      if (map.current == null) {
        return;
      }
      if (mapids.indexOf(p.id) !== -1) {
        return;
      }
      if (markers.find((m) => m.id === p.id)) {
          return false;
      }
      if (p.kind === "point" && p.year !== undefined && p.year <= year ) {
          let m = GenerateMarker(p);
          m.addTo(map.current)
          markers.push({
            id: p.id,
            marker:m
        })
      }
      if (p.kind === "3D_Shape" && p.three_d_model_props !== undefined) {
          mapids.push(p.id);
          map?.current?.addLayer(Generate3DModel(map,p.three_d_model_props));
        }
      if (p.kind === "shape" && p.id === "B") { // TEST
        mapids.push(p.id);
        GetGemoetryFromFile(p.shape_file_slug ?? "").then((g) => {
          map?.current?.addSource(p.id, {
            type: "geojson",
             data: g,
          });
          map?.current?.addLayer({
        id: p.id,
        type: 'fill',
        source: p.id,
        layout: {},
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.5
        }
      });
        });
      }
    });

  }, [year]);
  useEffect(() => {
    if (map === null || map.current === null) return;
    markers.forEach((m) => {

      let d = MapData.find((a) => a.id === m.id);
      if ((d?.year ?? 100000) < year) {
        console.log("added!")
        if (map.current === null) {
          console.log("WARNING")
        }
        if (map === null || map.current === null) return;
        map.current._addMarker(m.marker)
      } else {
        m.marker.remove();
        setMarkers(markers.filter((a) => a.id !== m.id))
      }
    })
  }, [markers, year])
  return <div className="map-container" ref={mapContainer} />;
}
