import mapboxgl, {CustomLayerInterface} from "mapbox-gl";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import store from "../../store/store";
// @ts-ignore
import { Threebox } from "threebox-plugin";
import timeline from "../../store/timeline";
import  MapData  from "../../assets/MapData.json"

export interface ModelProps {
  model_slug: string;
  id: string;
  lat: number;
  long: number;
  rotation: number;
  scale: number;
  year: number
}


export function Generate3DModel(mapRef : React.RefObject<any>, props: ModelProps, year: number,a : any) : CustomLayerInterface {
  const tyear = store.getState().timeline.value;
  return {
    id: props.id,
    type: "custom",
    renderingMode: "3d",
    onRemove: function() {
      (window as any).tb.removeLayer(props.id)
    },
    onAdd: function () {
      (window as any).tb =  a;
        const scale = props.scale;
      const options = {
        obj: props.model_slug, //assets/3d/Log.fbx
        type: props.model_slug.split(".").at(1),
        scale: { x: scale, y: scale, z: scale },
        units: "meters",
        rotation: { x: 90, y: 90, z: 0 },
      };
      (window as any).tb.loadObj(options, (model : any) => {
        model.setCoords([props.long, props.lat]);
        model.setRotation({ x: 0, y: 0, z: props.rotation });
        (window as any).tb.add(model);
      });
    },
    render: function () {
        let a = (window as any).tb.world.children;
        a.forEach((b : any) => {
          if (shouldShowModel(b.coordinates)) {
              b.visible = true;
              (window as any).tb.update();
          } else {
              b.visible = false;
        }
        }
      )
    },
  };
}

function shouldShowModel(location: any): Boolean {
  const tyear = store.getState().timeline.value;
  if (location === undefined) return false;
  if (location.length != 2) return false;
  var o = false;
  MapData.forEach((m) => {
    if (m.three_d_model_props === undefined) return;
    if (m.three_d_model_props.lat === location[1] && m.three_d_model_props.long === location[0]) {
      if (m.year < tyear) {
        o = true;
      }
    }
  })

  return o;
}
