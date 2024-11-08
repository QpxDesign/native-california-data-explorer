import React, {useState, useRef, useEffect} from 'react';
import TimelineIcon from "../assets/TimelineIcon.svg"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store';
import {setYear} from "../store/timeline"

interface TimelineProps {
  year: number;
  classes: string;
}

export default function Timeline(props: TimelineProps) {
  const dispatch = useDispatch();
  const new_year = useSelector((state : RootState) => state.timeline.value);
  const MIN_YEAR = 1590;
  const MAX_YEAR = 2024;
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const [tyear, setTYear] = useState<number>(0);
  function scale (number : number, inMin : number, inMax : number, outMin : number, outMax : number) {
    let a : number = (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    return a;
}
  function handleDrag(e: React.DragEvent) {
    ghostbuster(e);
    let TIMELINE_START_X = thumbRef?.current?.getBoundingClientRect().x;
    let TIMELINE_WIDTH = thumbRef?.current?.getBoundingClientRect().width;
    if (TIMELINE_START_X === undefined || TIMELINE_WIDTH === undefined) {
      return;
    }
    if (e.clientX > TIMELINE_START_X && e.clientX < TIMELINE_START_X+TIMELINE_WIDTH) {
      let y = scale(e.clientX, TIMELINE_START_X, TIMELINE_START_X+TIMELINE_WIDTH, MIN_YEAR, MAX_YEAR);
      dispatch(setYear(y))
      setTYear(y)
    }
  }

  function ghostbuster(e: React.DragEvent) {
    var img = document.createElement("img");
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0)
  }
  useEffect(() => {
    setTYear(new_year);
  }, [new_year])
  useEffect(() => {

  },[tyear])
  return (
    <div className={"timeline-wrapper full-center " + props.classes} >
      <span className="start_year">1590</span>
      <div className="slider" style={{width:"90%", height:"1.5em", background: "white", borderRadius:"10em", margin: "1em", position:"relative", padding:0, marginTop:"2em"}} ref={thumbRef}>
        <div className="thumb"  style={{left: String(scale(tyear, MIN_YEAR, MAX_YEAR, 0, 100)) + "%", transition:"0s", position:"relative"}} onDrag={(e) => handleDrag(e)} onDragStart={(e) => {ghostbuster(e)}} draggable={true}>
        <img src={TimelineIcon} style={{background:"transparent", cursor:"none"}} onMouseDown={() => {return false}}/>
          <span style={{position:"absolute", transform:"translate(-139%, 10px)", cursor:"none"}}>{Math.floor(tyear)}</span>
        </div>
      </div>
      <span className="start_year">2024</span>
    </div>);
}
