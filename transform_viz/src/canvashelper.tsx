//essentially all the objects we are going to render are going to be in form of arrays of points
import {Expression} from "./calculator"
type Line = [number[],number[]];
function generatePointsLine(x0:number, y0:number, x1:number, y1:number, pointsCount:number): Line{
    let xvalues:number[] = [];
    let yvalues:number[] = [];

    for (let i = 0; i<= pointsCount-1; i++){
        xvalues.push(x0 + i/pointsCount*(x1-x0));
        yvalues.push(y0 + i/pointsCount*(y1-y0));
    }

    return [xvalues,yvalues];
}

function drawLine(line : Line, ctx:CanvasRenderingContext2D ):void{
    ctx.beginPath();
    ctx.moveTo(line[0][0],line[1][0]);
    for (let i = 1; i < line[0].length; i++){
        ctx.lineTo(line[0][i],line[1][i]);
    }
    ctx.stroke();
}

function transformLine(line:Line, x_expr : Expression, y_expr : Expression) : Line{
    let xval = [];
    let yval = [];
    for (let i = 0 ; i < line[0].length; i++){
        xval.push(x_expr.eval({"x":line[0][i], "y":line[1][i]}));
        yval.push(y_expr.eval({"x":line[0][i], "y":line[1][i]}));
    }


    return [xval,yval];
}

function transitionLine(line1:Line, line2:Line, t:number) : Line{
    //t=0 : line1
    //t=1 : line2

    let xval = [];
    let yval = [];
    for (let i = 0; i < line1[0].length; i++){
        xval.push(line1[0][i] + t*(line2[0][i]-line1[0][i]));
        yval.push(line1[1][i] + t*(line2[1][i]-line1[1][i]));
    }
    return [xval,yval];
}

function interpolate(a:number, b:number, t:number):number{
    return a + t*(b-a);
}


function drawTransition(line1:Line, line2:Line, t:number,ctx:CanvasRenderingContext2D) : void{
    ctx.beginPath();
    ctx.moveTo(interpolate(line1[0][0],line2[0][0],t),interpolate(line1[1][0],line2[1][0],t));
    for (let i = 0; i < line1[0].length; i++){
        ctx.lineTo(interpolate(line1[0][i],line2[0][i],t),interpolate(line1[1][i],line2[1][i],t));
    }
    ctx.stroke();
}

function generateLineGrid(precision:number):Line[]{
    let result = [];
    for (let i = -precision; i <= precision; i+=2){ 
        result.push(generatePointsLine(i,-precision,i,precision,20*precision));
        result.push(generatePointsLine(-precision,i,precision,i,20*precision));
    }
    return result;
}

function clearGrid(ctx:CanvasRenderingContext2D,c:HTMLCanvasElement){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.setTransform(1,0,0,1,0,0)
    ctx.fillRect(0,0,c.width,c.height);
    ctx.restore();
}

export{
    generatePointsLine,
    generateLineGrid,
    drawLine,
    transformLine,
    transitionLine,
    clearGrid,
    drawTransition
}

export type{
    Line
}