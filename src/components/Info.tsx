import React, {useEffect, useState, useRef} from 'react';
import Timeline from "./Timeline"
import InfoSections from "../assets/InfoSections.json"
import { BsArrowDown } from "react-icons/bs";

interface InfoSectionItem {
  id: string;
  index: number;
  title: string;
  text:string;
  image_slug: string;
  year: number;
  sources: [string];
}

export default function Info() {
  const [pos, setPos] = useState(0);


  if (pos == 0) {
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
    let  SectionInfo = InfoSections.find((a) => a.index === pos);
    return (
    <div className="info-container" onWheel={() => pos < InfoSections.length ? setPos(pos+1) : setPos(pos)}>
      <img src={SectionInfo?.image_slug} style={{objectFit:"contain", width:"30em",marginRight:"auto"}}/>
      <h1 style={{fontSize:"2.3rem",textAlign:"left",width:"95%"}}>{SectionInfo?.title ?? "error"}</h1>
      <p style={{fontSize:"1.2rem",textAlign:"left",width:"95%"}}>{SectionInfo?.text ?? "error"}</p>

        <Timeline year={1750}/>
    </div>
    )
  }

}

//    <span className="full-center" style={{fontSize:"1.2em", }}><BsArrowDown style={{padding:0, margin: 0, marginRight: ".2em"}}/> Scroll Down</span>
