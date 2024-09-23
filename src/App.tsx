import React, {useRef, useEffect, useState} from 'react';
import Map from "./components/Map";
import Info from "./components/Info"
import Timeline from "./components/Timeline"
import "./App.css"

function App() {
 return <>
    <div style={{display:"flex", flexWrap:"wrap", width:"100vw", height:"100vh"}}>
    <Map />
    <div className="map-only-timeline-wrapper">
      <Timeline year={1590} classes={"map-only-timeline"}/>
    </div>
    <Info />
    </div>
  </>
}

export default App;
