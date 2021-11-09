
import './App.css';
import Threejs from './components/Threejs.js'
import {ExportControls} from './components/Exporter'
import {Audio} from './components/Audio'
import image from './texture/blue.jpg'
import Preview from './components/Preview'

function App() {
  return (
    <div className="App">
      <div id="container">
      <ExportControls/>
      <Threejs id="canvasExport" width="8000" height="8000"/>
      <Preview/>
      </div>
    </div>
  );
}

export default App;
