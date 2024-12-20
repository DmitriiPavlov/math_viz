import { useState } from 'react'
import styles from "./Input.module.css"
import {Expression,processExpression} from "./calculator.tsx"
import {settings} from './settings.ts';


type InputProps = {
    callback: (x: Expression, y: Expression) => void;
  };

function Input({callback}:InputProps){
      //for rn we are just making a simple calculator
    const [xStr,setX] = useState("");
    const [yStr,setY] = useState("");
    const [errormsg,setError] = useState("");
    const [speed,setSpeed] = useState(settings.SPEED);
    function clicked(){
        let errorred = false;
        var xexpr:Expression = new Expression();;
        let yexpr:Expression = new Expression();
        let x = xStr; let y = yStr;
        if ((xStr.replace(" ","")) == "")  x = "x";
        if ((yStr.replace(" ","")) == "")  y = "y"
        try 
        {
            xexpr = processExpression(x);
        }
        catch(error:any){
            errorred = true;
            if (error.message == ""){
                setError(error.message);
            }
            else{
                setError("Invalid input in the x field.")
            }
        }
        try {yexpr = processExpression(y)}
        catch(error:any){
            errorred = true;
            if (error.message == ""){
                setError(error.message);
            }
            else{
                setError("Invalid input in the y field.")
            }
        }


        if (!xexpr.validateVariables(["x","y"])){
            errorred = true;
            setError("Invalid expression for x.");
        }
        if (!yexpr.validateVariables(["x","y"])){
            errorred = true;
            setError("Invalid expression for y.");
        }


        if (!errorred) {
            callback(processExpression(x),processExpression(y));
            setError("");
        }
    }

    return (
        <>
        <div className ={styles.container}>
        <p>x,y</p>
        <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="23.727" height="19.3088">  <g>   <rect height="19.3088" opacity="0" width="23.727" x="0" y="0"/>   <path d="M23.727 9.63585C23.727 9.30762 23.5832 8.99395 23.3355 8.7558L15 0.407348C14.7104 0.122731 14.412 0 14.1059 0C13.4308 0 12.9398 0.489943 12.9398 1.1403C12.9398 1.47586 13.0611 1.77328 13.2866 1.98717L16.5694 5.30871L20.9953 9.38964L21.3739 8.66658L17.2378 8.44155L1.20681 8.44155C0.495136 8.44155 0.000974472 8.93679 0.000974472 9.63585C0.000974472 10.3349 0.495136 10.8301 1.20681 10.8301L17.2378 10.8301L21.3739 10.6051L20.9953 9.89153L16.5694 13.963L13.2866 17.2824C13.0656 17.4918 12.9398 17.7937 12.9398 18.1293C12.9398 18.7796 13.4308 19.2696 14.1059 19.2696C14.412 19.2696 14.7014 19.1468 14.9596 18.9027L23.3355 10.5159C23.5832 10.2777 23.727 9.96407 23.727 9.63585Z" fill="#ffffff" fill-opacity="0.85"/>  </g> </svg>
        <div className = {styles.inputdiv}>
            <input type="text" placeholder={"x"} onChange = {(e)=>{setX(e.target.value)}}></input>
            <p>,</p>
            <input type="text" placeholder={"y"} onChange = {(e)=>{setY(e.target.value)}}></input>
        </div>
        <div className={"buttons"}>
        <button onClick={()=>{clicked()}}>Transform</button>
        <button onClick={()=>{callback(processExpression("x"),processExpression("y"))}}>Reset</button>
        <button onClick={()=>{setSpeed((speed)%10+1); settings.SPEED = (speed)%10+1;}}>{`Speed: ${speed}`}</button>
        </div>
        <p className={styles.errormsg}>{errormsg}</p>
        </div>
        </>
    )
}

export default Input