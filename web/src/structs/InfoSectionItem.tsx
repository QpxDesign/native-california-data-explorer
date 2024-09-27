import { MapPosition } from "./MapPosition";

export interface InfoSectionItem {
  id: string;
  index: number;
  title: string;
  text:string;
  image_slug: string;
  year: number;
  sources: [string];
  map_position:MapPosition
}
