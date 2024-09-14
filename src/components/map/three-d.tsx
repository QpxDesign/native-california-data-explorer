import mapboxgl, {CustomLayerInterface} from "mapbox-gl";
// @ts-ignore
import { Threebox } from "threebox-plugin";

export interface ModelProps {
  model_slug: string;
  lat: number;
  long: number;
  rotation: number;
  scale: number;
}

export function Generate3DModel(mapRef : React.RefObject<any>, props: ModelProps) : CustomLayerInterface {
  return {
    id: props.model_slug,
    type: "custom",
    renderingMode: "3d",
    onAdd: function () {
      (window as any).tb = new Threebox(
        mapRef.current,
        mapRef.current.getCanvas().getContext("webgl"),
        { defaultLights: true },
      );
      const scale = 3;
      const options = {
        obj: props.model_slug, //assets/3d/Log.fbx
        type: props.model_slug.split(".").at(1),
        scale: { x: scale, y: scale, z: 2.7 },
        units: "meters",
        rotation: { x: 90, y: 90, z: 0 },
      };

      (window as any).tb.loadObj(options, (model : any) => {
        model.setCoords([props.long, props.lat]);
        model.setRotation({ x: 0, y: 0, z: 241 });
        (window as any).tb.add(model);
      });
    },

    render: function () {
      (window as any).tb.update();
    },
  };
}
