import mapboxgl from "mapbox-gl";
import Position from "mapbox-gl"
import {Geometry} from "geojson"

export interface ShapeGeometry {
  type: string;
  coordinates: number[][];
}

export async function GetGemoetryFromFile(slug: string): Promise<Geometry> {
  return fetch(slug)
    .then((r) => r.json())
    .then((r) => {
      return r;
    })
    .catch((e) => {
      console.log("error")
      return {
        type: "Polygon",
        coordinates: [[]]
      }
    })
}
