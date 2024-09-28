import mapboxgl, {MapMouseEvent} from "mapbox-gl"
import Metadata from "../../assets/Metadata.json"

export function ShapePopup(map : React.RefObject<any>, e : MapMouseEvent) {
    if (map.current === null) return; // JSON.stringify(JSON.parse(JSON.stringify(e.features[0])).properties).Name
    if (e.features === undefined || e.features.length === 0) return;
    console.log(e.features[0].properties)
    let html = getTitleFromMetadata(e.features[0].properties?.q_id).Title
    let po = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML((e.features[0].properties?.Name ?? "WHOOP") + " - " + html)
        .addTo(map.current)
}

function getTitleFromMetadata(q_id: string): any{
  let a = Metadata.find((a : any) => a.q_id === q_id)
  console.log(a)
  return a
}
