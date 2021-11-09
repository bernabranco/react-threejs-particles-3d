import { React } from 'react'
import {vertexShader} from './glsl/vertex'
import {fragmentShader} from './glsl/fragment'
import * as traits from './traits'

import { saveAs } from 'file-saver';

//export buttons
function ExportControls() {
    return (
        <div id='buttonContainer'>
            <button id='exporter1' onClick={() => ExportImage()}>
                EXPORT IMAGE
           </button>
           <button id='exporter2'>
                EXPORT VIDEO
           </button>
        </div>
    )
}

//export single image
function ExportImage(frameCount){

    var canvas = document.getElementById('canvasExport');
    var dataURL = canvas.toDataURL("image/jpeg");

    var downloadLink = document.createElement('a');
    downloadLink.download = 'particle'+frameCount;
    downloadLink.href = dataURL;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    //ExportText(frameCount)
}

function ExportText(frameCount) {

    const values = `
    'title: particles-2d-grid'
    'offset:'${traits.offset}
    'particle count:'${traits.PARTICLE_COUNT}
    'particle size:'${traits.PARTICLE_SIZE}
    'particle steps':${traits.STEPS}
    'hsl:'${traits.HSL}

    'fragmentShader:'${fragmentShader}
    'vertexShader:'${vertexShader}
    `

    var FileSaver = require('file-saver');
    var blob = new Blob([values], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, 'particle-2d-grid-' + frameCount);
}

export {ExportControls, ExportImage}