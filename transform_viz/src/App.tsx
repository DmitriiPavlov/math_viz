import Input from './Input.tsx'
import { Expression, processExpression } from './calculator.tsx'
import { useState,useEffect} from 'react';
import styles from "./App.module.css"
import {transformLine,Line,generateLineGrid} from "./canvashelper.tsx"
import { initializeContext } from './viewport.tsx';
import {animateMorph} from  "./animate.tsx";
import { settings } from './settings.ts';
function App() {
  const [xTransform, setX] = useState(processExpression("x"));
  const [yTransform, setY] = useState(processExpression("y"));




  useEffect(()=>{
    var c= document.getElementById("mycanvas") as HTMLCanvasElement;
    var ctx = initializeContext(-10,-10,10,10,c);
    let x_expr = xTransform;
    let y_expr = yTransform; 
    if (window.innerWidth<768){
      settings.MOBILE =true;
    }
    
    var line1:Line[]; 
    if (settings.MOBILE){
      line1 = generateLineGrid(20);
    }
    else{
      line1 = generateLineGrid(100);
    }
    if (ctx == null) return;

    let line2 = line1.map((line)=>transformLine(line,x_expr,y_expr));
    animateMorph(line1,line2,ctx,c);


  })

  return <>
  <div className = {styles.overlay}>
  <Input callback={(x:Expression,y:Expression)=>{
    setX(x);
    setY(y);
  }}/>
  </div>
  <canvas className = {`${styles.overlay} ${styles.canvas}`} id = {"mycanvas"} height = {"100%"} width = {"100%"}></canvas>
  </>
}

export default App
