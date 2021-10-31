
import './App.css';

import Threejs from './components/Threejs.js'

import {ExportControls} from './components/Exporter'
import {Audio} from './components/Audio'
import image from './texture/circle.png'

function App() {
  
  return (
    <div className="App">
      <div id="container">

       <img alt="image1" id="image" src={image}/>
      <canvas id="imageCanvas"></canvas> 
 
      <Threejs id="canvasExport" width="8000" height="8000"/>
      <ExportControls/>
      
      
      
      {/* <Threejs id="canvasPreview" width="8000" height="8000"/>   */}
      </div>
    </div>
  );
}

export default App;
