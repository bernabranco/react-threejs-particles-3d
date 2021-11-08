import {React} from 'react'

// create preview canvas
export default function Preview(){
    return(
        <canvas id="canvasPreview"></canvas>
    )
}

// draw canvas preview
export function drawPreview(renderer, ctx){
    var previewCanvas = document.getElementById('canvasPreview');

    // setup preview canvas attributes
    previewCanvas.setAttribute('width',ctx.drawingBufferWidth);
    previewCanvas.setAttribute('height',ctx.drawingBufferHeight);

    // grab the context from your destination canvas
    var destCtx = previewCanvas.getContext('2d');

    // call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(renderer.domElement, 0, 0);
}
