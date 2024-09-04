import React, {useRef, useEffect, useState} from 'react';
import Map from "./components/Map";
import Info from "./components/Info"
import "./App.css"

function App() {
 return <>
    <div style={{display:"flex", flexWrap:"wrap", width:"100vw", height:"100vh"}}>
    <Map />
    <Info />
    </div>
  </>
}

export default App;
