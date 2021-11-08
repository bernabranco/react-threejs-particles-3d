
import { useEffect } from 'react'
import * as THREE from 'three' // threejs library
import Stats from './Stats.js' // performance library (fps)
import { vertexShader } from './glsl/vertex.js'
import { fragmentShader } from './glsl/fragment.js'
import {ExportImage} from './Exporter'
import * as imgAnalize from './Image' // analysed image data
import texture1 from '../texture/particle0.jpeg' // particles point texture
import * as hexColors from './colors.js' // background colors array
import * as audio  from './Audio.js' // audio analysis (frequency + volume)
import * as traits from './traits.js' // generative traits
import * as preview from './Preview.js' // preview window

export default function Threejs(props) {

	function imageAnalyze(){

		var imgSrc = texture1;
		var img = new Image();
		img.crossOrigin = "anonymous";
		img.src = imgSrc;

      img.onload = function() {

		var width = img.width;
		var height = img.height;

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		var imageData = ctx.getImageData(0, 0, width, height);

        document.body.appendChild(canvas);
        three(imageData, width, height);
      };
	}

	function three( imageData, width, height ){

		//particle settings
		const PARTICLES = traits.PARTICLE_COUNT;
		const PARTICLESIZE = traits.PARTICLE_SIZE;
		const zoom = 1000;

		//export video settings
		let frameCount = -1;
		let startFrame = 0;
		let endFrame = 1200;
		var exportVideo = false;

		const canvasSize = [
			window.innerWidth,
			window.innerHeight
		] 

		var mouseX = 1.;
		var mouseY = 1.;
		
		// Setup Scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(hexColors.background);
		//scene.background = new THREE.Color(0x000000);
		// Setup geometry
		const geometry = new THREE.BufferGeometry();

		// Setup geometry initial attributes
		const positions = [];
		const colors = [];
		const sizes = [];
		const particle_id = [];
		//const color = new THREE.Color(hexColors.particleColor);

		var color = new THREE.Color();
		for (let i = 0; i < imageData.data.length; i+=4) {
				const r = imageData.data[i + 0];
				const g = imageData.data[i + 1];
				const b = imageData.data[i + 2];
				const a = imageData.data[i + 3];
				color.setRGB(r, g, b);
				colors.push(color.r, color.g, color.b);
		 }

		// Setup particle positions (2D Grid)
		var steps = traits.STEPS;
		for(let x = 0; x < width; x+=steps){
			for(let y = 0; y < height; y+=steps){
				positions.push( x - width*0.5, y - height*0.5, 0 );
				sizes.push( PARTICLESIZE );
			}
		}

		// Setup shader particles colors and sizes
		for (var i = 0; i<PARTICLES; i++){
			//const hexColor = parseInt(Math.random()*traits.colorPallete.length)
			//color.setHSL( i/PARTICLES*traits.HSL_RANDOM, 1, 0.5 )
			//console.log(hexColors.hexColors[10])
			//color.setRGB(imageRed[i], imageGreen[i],imageBlue[i]);
			//color.setRGB(Math.random(), Math.random(), Math.random());
			//colors.push( color.r, color.g, color.b );
			//array with size of each particle
			//sizes.push( PARTICLESIZE );
		}

		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
		geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ));
		geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );
		geometry.setAttribute( 'id', new THREE.Float32BufferAttribute( particle_id, 1 ).setUsage( THREE.DynamicDrawUsage ) );

		// Setup material uniforms
		const uniforms = {
			pointTexture: { value: new THREE.TextureLoader().load(texture1) },
			u_time: {value: 1.0},
			u_mousex: {value: 1.0},
			u_mousey: {value: 1.0},
			u_width: canvasSize[0],
			u_height: canvasSize[1],
			u_size: {value: 1.0},
			u_sound: {value: 1.0},
			u_offset: {value: traits.offset},
		};

		// Setup custom material
		const material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			//blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true
		} );

		// Setup mesh
		const mesh = new THREE.Points( geometry, material);
		mesh.rotation.z = -Math.PI / 2;
		scene.add( mesh );

		// Setup lights
		const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
		const light = new THREE.PointLight( 0xff0000, 1, 100 );
		light.position.set( 50, 50, 50 );
		light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
		scene.add( light );

		// Setup camera
		const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000*PARTICLESIZE );
		camera.position.z = zoom;

		// Setup renderer / canvas
		const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true, alpha:true});
		renderer.domElement.setAttribute('id', props.id);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( canvasSize[0], canvasSize[1] );
		renderer.autoClearColor = true;

		// Setup orbit Controls for camera
		var OrbitControls = require('three-orbit-controls')(THREE)
		var controls = new OrbitControls(camera, renderer.domElement )
		controls.autoRotate = false;
		controls.autoRotateSpeed = 2;
		
		// Setup Container css
		const container = document.getElementById( 'container' );
		container.appendChild( renderer.domElement );

		// Animation / render frames
		function animate() {

			// Use framecount to animate
			frameCount++;

			// Rotate mesh
			//particleSystem.rotation.x = frameCount*0.001;
			//particleSystem.rotation.y = frameCount*0.001;
			//particleSystem.rotation.z = frameCount*0.001;

			material.uniforms.u_time.value = frameCount*0.005;
			material.uniforms.u_sound.value = audio.volume;
			material.uniforms.u_mousex.value = mouseX;
			material.uniforms.u_mousey.value = mouseY;

			if(exportVideo === true){
				if(frameCount>startFrame && frameCount<endFrame){
					ExportImage(frameCount);
				}
			}

			// update orbit controls
			controls.update()

			// update preview canvas
			//var previewCanvas = renderer.getContext('2d');
			//preview.drawPreview(renderer, previewCanvas);

			renderer.render( scene, camera );
			requestAnimationFrame( animate );
		}

		animate();

		// Export canvas video when click on export video
		const buttonExport = document.getElementById("exporter2");
		buttonExport.onclick = function(){
			frameCount = -1;
			exportVideo = true;
		};

		// Event listeners
 		window.onresize = function() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		};

		// Get mouse position relative to middle of screen
	    window.onmousemove = function(e) {
			mouseX = e.clientX - window.innerWidth*0.5;
			mouseY = e.clientY - window.innerHeight*0.5;
		};

		// Get performance stats (fps)
		(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
	}


	useEffect(() => {
		window.onload = ()=>{
			var canvas = document.getElementById('imageCanvas')
			var image = document.getElementById('image')
			var ctx = canvas.getContext('2d')
			ctx.drawImage(image,0,0,canvas.width, canvas.height)
			
			const imageRed = imgAnalize.getRed(imgAnalize.getImageData(ctx, canvas));
			const imageGreen = imgAnalize.getGreen(imgAnalize.getImageData(ctx, canvas));
			const imageBlue = imgAnalize.getBlue(imgAnalize.getImageData(ctx, canvas));
	
			imageAnalyze();
		}
	});

	return (
		null
	)
}



