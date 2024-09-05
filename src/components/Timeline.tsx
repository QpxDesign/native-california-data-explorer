import React, {useState} from 'react';
import TimelineIcon from "../assets/TimelineIcon.svg"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store';

interface TimelineProps {
  year: number;
}

export default function Timeline(props: TimelineProps) {
  const year = useSelector((state : RootState) => state.timeline.value);
  const MIN_YEAR = 1590;
  const MAX_YEAR = 2024;
  function scale (number : number, inMin : number, inMax : number, outMin : number, outMax : number) {
    let a : Number = (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    return a;
}
  return (
    <div className="timeline-wrapper full-center">
      <span className="start_year">1590</span>
      <div className="slider" style={{width:"90%", height:"1.5em", background: "white", borderRadius:"10em", margin: "1em", position:"relative", padding:0}}>
        <div className="thumb"  style={{left: String(scale(year, MIN_YEAR, MAX_YEAR, 0, 100)) + "%", transition:"2s"}}>
        <img src={TimelineIcon} style={{background:"transparent"}} />
        </div>
      </div>

      <span className="start_year">2024</span>
    </div>);
}
