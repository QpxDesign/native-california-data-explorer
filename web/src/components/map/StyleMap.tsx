import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl";

export function StyleMap(map : React.MutableRefObject<Map | null>) {
     map?.current?.on("load", function () {
      map?.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 10
      });
      map?.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      map?.current?.addLayer(
        {
          id: 'hillshading',
          source: 'dem',
          type: 'hillshade'
        },
        'land-structure-polygon'
      );
      map?.current?.setPaintProperty("landuse", 'fill-color', "#E0E0CF"); //#EE4B2B #ADDA8F ##E0E0CF
      const keepKeywords = ["land", "water", "wet", "hill", "pitch-"]
      map?.current?.getStyle()?.layers.map(function (layer : any) {
        console.log(layer)
        if (layer.type === "symbol") {
          map?.current?.setLayoutProperty(layer.id, "visibility", "none");
          return;
        }
        if (layer.id.indexOf("road") >= 0) {
          map?.current?.setLayoutProperty(layer.id, "visibility", "none");
          return;
        }
        var keep = false;
        for (var i=0; i < keepKeywords.length; i++) {
          if (layer.id.search(keepKeywords[i]) !== -1) {
            keep = true
            break;
          }
        }
        if (!keep) {
          map?.current?.setLayoutProperty(layer.id, "visibility", "none");
        } else {
        }
      });
    });
}
