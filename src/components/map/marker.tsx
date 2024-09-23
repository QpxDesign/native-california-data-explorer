import { MapItem } from "../../structs/MapItem";
import mapboxgl from "mapbox-gl";

export function GenerateMarker(p: MapItem) : mapboxgl.Marker {
  const icon = document.createElement("img");
  icon.src = p.icon_slug ?? "https://www.svgrepo.com/show/127575/location-sign.svg"; // default icon (REPLACE WITH FILES/SELF-HOSTED IMAGES)
  icon.className = "map_icon";
  var marker = new mapboxgl.Marker({
    color: "#004D93",
    element: icon
  })
    .setLngLat([p?.long ?? 0, p?.lat ?? 0])
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
          }) // add popups
            .setHTML(
              `<div class="stopPopup"><h1 class="stopName">${p.title}</h1>
              </div>`
            )
        )
  return marker;
}

