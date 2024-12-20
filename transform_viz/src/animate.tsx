import {clearGrid,Line, drawTransition} from "./canvashelper.tsx"
import { settings} from "./settings.ts";

function animateMorph(start_lines:Line[], end_lines:Line[],ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement):void{
    var t = 0;
    function update() {
        clearGrid(ctx,canvas);

        for (let i = 0; i < start_lines.length; i++){
            drawTransition(start_lines[i],end_lines[i],t,ctx);
        }
        t+=0.001*settings.SPEED;
        console.log(settings.SPEED);

        
        if (t>1){
            clearGrid(ctx,canvas);

            for (let i = 0; i < start_lines.length; i++){
                drawTransition(start_lines[i],end_lines[i],1,ctx);
            }
            return;
        }
        requestAnimationFrame(update);
    }

    update();
}

export{
    animateMorph
}