//takes bottom left and bottom right coordinates, and makes those the virtual coordinates for the screen's bottom left and bottom right
function initializeContext(x0: number, y0: number, x1: number, y1: number, c: HTMLCanvasElement):CanvasRenderingContext2D | null{
    var ctx = c.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * ratio;
    c.height = c.offsetHeight * ratio;

    if(ctx == null) return null;

    ctx.strokeStyle = "white";

    
    ctx.scale(ratio,ratio);
    ctx.translate(0.5,0.5);
    ctx.lineWidth /=c.width / (x1 - x0);
    ctx.setTransform(
        c.width / (x1 - x0),
        0,                   
        0,                  
        -c.height / (y1 - y0), 
        -x0 * (c.width / (x1 - x0)), 
        c.height + y0 * (c.height / (y1 - y0)) 
    );
    return ctx;
}

export{
    initializeContext
}