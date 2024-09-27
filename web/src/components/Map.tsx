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
import { ShapeGeometry } from "./map/shape";
import Position from "mapbox-gl";
import { Generate3DModel } from "./map/three-d";
import {StyleMap} from "./map/StyleMap"
// @ts-ignore
import { Threebox } from "threebox-plugin";

type Marker = {
  id: string,
  marker: mapboxgl.Marker
}

export default function Map() {
  const map_pos = useSelector((state: RootState) => state.map.value);
  const tyear = useSelector((state: RootState) => state.timeline.value);
  const [year, setYear] = useState(1590);
  const [markers, setMarkers] = useState<Array<Marker>>([]);
  const [models, setModels] = useState<Array<MapItem>>([])
  const [fireda, setFireda] = useState<Boolean>(false);
  const [firedb, setFiredb] = useState<Boolean>(false);

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
    StyleMap(map)
    map.current.addControl(new mapboxgl.NavigationControl());
  });
  useEffect(() => {
    if (!map.current?.loaded()) return;
    MapData.forEach((md) => {
    if (md.three_d_model_props === undefined) {
        return;
      }
    if((md.year ?? 10000) < year) {
        map.current?.setLayoutProperty(md.three_d_model_props?.id, "visibility","visible")
        console.log("SHOWN - " + md.three_d_model_props?.id)
    }
    if((md.year ?? 0) > year) {
      //map.current?.setLayoutProperty(md.three_d_model_props?.id, "visibility","none")
     // console.log("HIDDEN - " + md.three_d_model_props?.id)
    }
    })
  }, [year])
  useEffect(() => {
    if (!fireda && map.current?.loaded() && map.current !== null) {
      console.log("ADDED")
      setFireda(true)
       MapData.forEach((md) => {
        if (md.three_d_model_props !== undefined && map.current !== null) {
          let a = new Threebox(
        map.current,
        map.current.getCanvas().getContext("webgl"),
        { defaultLights: true },
      );
            map.current?.addLayer(Generate3DModel(map, md.three_d_model_props, md.year, a));
            map.current?.setLayoutProperty(md.three_d_model_props?.id, "visibility","none")
        }
               });
    }
       })
  useEffect(() => {
    MapData.forEach((md) => {
      if (md.kind !== "point") return;
      if (markers.find((m) => m.id === md.id) === undefined && (md?.year ?? 100000) < year) {
        if (map === null || map.current === null) return;
        let m = GenerateMarker(md);
        m.addTo(map.current)
        setMarkers(markers => [...markers, {id: md.id, marker: m}])
      }
      if (markers.find((m) => m.id === md.id) !== undefined && (md?.year ?? 0) > year) {
        markers.find((m) => m.id === md.id)?.marker.remove();
        let a = markers.find((m) => m.id === md.id);
        if (a !== undefined) {
          map.current?._removeMarker(a.marker);
        }

        setMarkers(markers.filter((a) => a.id !== md.id))
      }

    })
  }, [year])
  return <div className="map-container" ref={mapContainer} />;
}