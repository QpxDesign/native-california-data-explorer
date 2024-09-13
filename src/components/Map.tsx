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

export default function Map() {
  const map_pos = useSelector((state: RootState) => state.map.value);
  const DEFAULT_MAP_LOCATION = [36.7783, -119.4179, 5];
  const dispatch = useDispatch();
  mapboxgl.accessToken =
    "pk.eyJ1IjoicXBhdHdhcmRoYW4tb3h5IiwiYSI6ImNtMG9hdTdvZjA2bW0ybW9pOG9lMnl5ZTEifQ.qIkMeJEiiQTMx5TZM0bxOg";
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
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
    MapData.forEach((p: MapItem) => {
      if (map.current == null) {
        return;
      }
      if (p.kind === "point") {
        GenerateMarker(p).addTo(map?.current);
      }
      if (p.kind === "shape") {
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
  return <div className="map-container" ref={mapContainer} />;
}
