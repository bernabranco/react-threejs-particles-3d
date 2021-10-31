import { React, useEffect } from 'react'

let frequency;    
let volume;   

function Audio() {

    useEffect(() => {

        navigator.getUserMedia = navigator.getUserMedia
            || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia;

        navigator.getUserMedia({ video: false, audio: true }, getSound, console.log);

        function getSound(stream) {

            var ctx = new AudioContext();
            var mic = ctx.createMediaStreamSource(stream);
            var analyser = ctx.createAnalyser();
            mic.connect(analyser);

            var data = new Uint8Array(analyser.frequencyBinCount);
            var buffer = new Uint8Array(analyser.fftSize);

            function analyzeFrequency() {
                analyser.getByteFrequencyData(data);
                var idx = 0;
                for (var j = 0; j < analyser.frequencyBinCount; j++) {
                    if (data[j] > data[idx]) {
                        idx = j;
                    }
                }

                frequency = idx * ctx.sampleRate / analyser.fftSize;
            }

            function analyzeVolume() {
                analyser.getByteTimeDomainData(buffer);
                volume = 0;
                for (var i = 0; i < buffer.length; i++){
                    volume += buffer[i] * buffer[i];
                }
                
                volume /= buffer.length;
                //-127 so that silence is 0
                volume = (Math.sqrt(volume) - 127) * 2.;
            }

            function update(){
                analyzeFrequency();
                analyzeVolume();
                requestAnimationFrame(update);
            }

            update();
        }
    },[])

    return (
        <div id='audio' className='audio'>
        </div>
    )
}

export {
    Audio,      //Audio component for App.js
    frequency,  //frequency value for Three.js
    volume      //volume value for Three.js
}



