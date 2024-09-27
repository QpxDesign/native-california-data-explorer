import { MapPosition } from "./MapPosition";
import { ModelProps } from "../components/map/three-d";

export interface MapItem {
  kind: string; // I.E. Point, Shape, etc.
  id: string;
  lat?: number;
  long?: number;
  shape_file_slug?: string;
  icon_slug?: string;
  alt_text: string;
  title: string;
  year?: number;
  three_d_model_props?: ModelProps;
}
