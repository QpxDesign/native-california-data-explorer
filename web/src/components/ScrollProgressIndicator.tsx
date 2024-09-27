import React, {useState, useRef, useEffect} from 'react';

interface ScrollProgressIndicator {
  percent: number
}

export default function ScrollProgressIndicator(props: ScrollProgressIndicator) {
  const [width, setWidth] = useState("")
  useEffect(() => {
    setWidth(determineWidth());
  }, [props.percent, width])
  function determineWidth():string {
    var a = Math.floor(props.percent * 100);
    if (a > 100) {
      a = 100;
    }
    //if (a < 30) {
    //  a = 30;
    // }
    console.log(a)
    return a + "%"
  }
  return (
    <div className="scroll-progress">
      <div className="mask" style={{width: width}}></div>
    </div>
  )

}
