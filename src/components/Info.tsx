import React, {useEffect, useState, useRef} from 'react';
import Timeline from "./Timeline"
import InfoSections from "../assets/InfoSections.json"
import { BsArrowDown } from "react-icons/bs";
import { useDispatch } from 'react-redux'
import { navigateTo} from "../store/map"
import {setYear} from "../store/timeline"

interface MapPosition {
  lat: number;
  long: number;
  zoom: number;
}

interface InfoSectionItem {
  id: string;
  index: number;
  title: string;
  text:string;
  image_slug: string;
  year: number;
  sources: [string];
  map_position:MapPosition
}


export default function Info() {
  const [pos, setPos] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const NEXT_SLIDE_THRESHOLD = 20;
  const dispatch = useDispatch();

  useEffect(() => {
    if (pos >= NEXT_SLIDE_THRESHOLD) {
        let  SectionInfo = InfoSections.find((a) => a.index === Math.floor(pos % NEXT_SLIDE_THRESHOLD));
        dispatch(navigateTo([SectionInfo?.map_position.lat, SectionInfo?.map_position.long, SectionInfo?.map_position.zoom]))
        dispatch(setYear(SectionInfo?.year))
    }
  }, [pos])

  useEffect(() => {
    if (pos >= NEXT_SLIDE_THRESHOLD) {
    setTimeout(() => {
      console.log(textOpacity);
      if (textOpacity < 1 && textOpacity + 0.05 < 1) {
        // fade in
        setTextOpacity(textOpacity + 0.05);
      }
    }, 3);
    }
  }, [pos, textOpacity]);

  if (pos < NEXT_SLIDE_THRESHOLD) {
    return (
      <div className="info-container" onWheel={() => setPos(pos+1)}>
        <h1>Californian Missions</h1>
        <h2>See how missions transformed native california over time</h2>
        <h5 style={{marginTop:"20em", fontSize:"1em", padding:0}}>Scroll Down</h5>
        <BsArrowDown style={{fontSize:"3em", padding:0, margin: 0}}/>
      <Timeline year={1590}/>
    </div>
    );
  } else {
    let  SectionInfo = InfoSections.find((a) => a.index === Math.floor(pos % NEXT_SLIDE_THRESHOLD));
        return (
    <div className="info-container fade-in" onWheel={() => Math.floor(pos % NEXT_SLIDE_THRESHOLD) < InfoSections.length ? setPos(pos+1) : setPos(pos)}>
      <div style={{opacity: textOpacity}}>
        <img src={SectionInfo?.image_slug} style={{objectFit:"contain", width:"30em",marginRight:"auto"}}/>
        <h1 style={{fontSize:"2.3rem",textAlign:"left",width:"95%"}}>{SectionInfo?.title ?? "error"}</h1>
        <p style={{fontSize:"1.2rem",textAlign:"left",width:"95%"}}>{SectionInfo?.text ?? "error"}</p>
      </div>
        <Timeline year={1750}/>
    </div>
    )
  }

}

//    <span className="full-center" style={{fontSize:"1.2em", }}><BsArrowDown style={{padding:0, margin: 0, marginRight: ".2em"}}/> Scroll Down</span>
