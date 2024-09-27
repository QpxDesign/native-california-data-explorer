import React, {useEffect, useState, useRef} from 'react';
import Timeline from "./Timeline"
import InfoSections from "../assets/InfoSections.json"
import { BsArrowDown } from "react-icons/bs";
import { useDispatch } from 'react-redux'
import { navigateTo} from "../store/map"
import {setYear} from "../store/timeline"
import { InfoSectionItem } from '../structs/InfoSectionItem';
import ScrollProgressIndicator from './ScrollProgressIndicator';

export default function Info() {
  const [pos, setPos] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  const [textOpacity, setTextOpacity] = useState(0);
  const [lastSwipe, setLastSwipe] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (pos > 0) {
        let  SectionInfo = InfoSections.find((a) => a.index === pos);
        dispatch(navigateTo([SectionInfo?.map_position.lat, SectionInfo?.map_position.long, SectionInfo?.map_position.zoom]))
        dispatch(setYear(SectionInfo?.year))
    }
  }, [pos])

  useEffect(() => {
    if (pos > 0) {
    setTimeout(() => {
      console.log(textOpacity);
      if (textOpacity < 1 && textOpacity + 0.01 < 1) {
        // fade in
        setTextOpacity(textOpacity + 0.01);
      }
    }, 1);
    }
  }, [pos, textOpacity]);
  const THRESHOLD = 30;
  function handleWheelGesture(event: React.WheelEvent<HTMLDivElement>) {
    const TIMEOUT = 2000; // miliseconds
    if (pos >= InfoSections.length) {
      return;
    }
    if (Date.now() - lastSwipe > TIMEOUT) {
      setDeltaY(event.deltaY)
    }

    if (Date.now() - lastSwipe > TIMEOUT && event.deltaY > THRESHOLD) {
      setPos(pos+1);
      setLastSwipe(Date.now());
    }
      if (Date.now() - lastSwipe > TIMEOUT && event.deltaY < -THRESHOLD && pos-1 >= 0) {
      setPos(pos-1);
      setLastSwipe(Date.now());
    }
  }
  if (pos == 0) {
    return (
      <div className="info-container" onWheel={(a) => handleWheelGesture(a)}>
        <div>
          <h1>Californian Missions</h1>
          <h2>See how missions transformed native california over time</h2>
          <h5 style={{fontSize:"1em"}}>Scroll Down</h5>
           <BsArrowDown style={{fontSize:"3em", padding:0, margin: 0, paddingBottom:"10vh"}}/>
        </div>
      <Timeline year={1590} classes=""/>
    </div>
    );
  } else {
    let  SectionInfo = InfoSections.find((a) => a.index === pos);
  return (
    <div className="info-container fade-in" onWheel={(a) => handleWheelGesture(a)}>
      <div style={{opacity: textOpacity, padding: 0, margin:0, overflowY:'scroll', overflowX: "hidden"}}>
        <img src={SectionInfo?.image_slug} style={{objectFit:"contain", width:"30em",marginRight:"auto"}}/>
        <h1 style={{fontSize:"2.3rem",textAlign:"left",width:"95%",paddingLeft:".33em"}}>{SectionInfo?.title ?? "error"}</h1>
        <p style={{fontSize:"1.2rem",textAlign:"left",width:"95%", paddingLeft:".33em"}}>{SectionInfo?.text ?? "error"}</p>
      </div>
        <Timeline year={SectionInfo?.year ?? 1590} classes = ""/>
    </div>
    )
  }

}
