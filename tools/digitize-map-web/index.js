let historicalOverlay;
let map;
async function initMap() {
  const IMAGE_HEIGHT_PX = 1144;
  const IMAGE_WIDTH_PX = 1444;

  const MAP_SCALE_MILES = 20;
  const MAP_SCALE_PIXELS = 182; // PIXEL WIDTH OF SCALE BAR ON MAP
  const PIXELS_PER_MILE = MAP_SCALE_PIXELS / MAP_SCALE_MILES;

  const CENTER_LAT = 34.81040803396024 - 0.07; // LAT + OFFSET
  const CENTER_LONG = -119.8129875606221 + 0.09; // LONG + OFFSET

  // DO NOT TOUCH
  const HEIGHT = IMAGE_HEIGHT_PX / PIXELS_PER_MILE / 69;
  const WIDTH =
    IMAGE_WIDTH_PX /
    PIXELS_PER_MILE /
    (69 * Math.cos(CENTER_LAT * (Math.PI / 180)));
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: CENTER_LAT, lng: CENTER_LONG },
    zoom: 10,
  });

  console.log(
    `SOUTHWEST CORNER: ${CENTER_LAT - HEIGHT / 2} ${CENTER_LONG - WIDTH / 2}`
  );
  console.log(
    `NORTHEAST CORNER: ${CENTER_LAT + HEIGHT / 2} ${CENTER_LONG + WIDTH / 2}`
  );
  const imageBounds = {
    north: CENTER_LAT + HEIGHT / 2,
    south: CENTER_LAT - HEIGHT / 2,
    east: CENTER_LONG + WIDTH / 2,
    west: CENTER_LONG - WIDTH / 2,
  };

  historicalOverlay = new google.maps.GroundOverlay(
    "./chumash.jpeg", // PATH_TO_MAP
    imageBounds
  );
  historicalOverlay;
  historicalOverlay.setOpacity(0.5);
  historicalOverlay.setMap(map);
}
initMap();
