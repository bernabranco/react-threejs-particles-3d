
import { useEffect, useState, useCallback } from 'react'
import * as THREE from 'three';
import Stats from './Stats.js'

import { vertexShader } from './glsl/vertex.js';
import { fragmentShader } from './glsl/fragment.js';

import {ExportImage} from './Exporter'

// analysed image data
import * as imgAnalize from './Image'

// particles point texture
import texture1 from '../texture/square.png'
import * as hexColors from './colors.js'

import {frequency, volume} from './Audio.js'


import * as traits from './traits.js'


export default function Threejs(props) {

	function three( imageRed, imageGreen, imageBlue ){

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
		const bg = hexColors.hexColors[parseInt(Math.random()*hexColors.hexColors.length)]
		scene.background = new THREE.Color(bg);
		
		// Setup geometry
		const geometry = new THREE.BufferGeometry();

		// Setup geometry initial attributes
		const positions = [];
		const colors = [];
		const sizes = [];
		const color = new THREE.Color();

		// Setup 2D Grid
	 	var xCount = Math.pow(PARTICLES, 1/2);
		var yCount = Math.pow(PARTICLES, 1/2);
		var steps = traits.STEPS;
		for(let x = 1; x < xCount; x+=steps){
			for(let y = 1; y < yCount; y+=steps){
				positions.push( x - xCount/2 ); 	// particle x
				positions.push( y - yCount/2 ); 	// particle y
				positions.push( 0 ); 				// particle z
			}
		}

		//3d grid
		// var xCount = Math.pow(PARTICLES, 1/3);
		// var yCount = Math.pow(PARTICLES, 1/3);
		// var zCount = Math.pow(PARTICLES, 1/3);

		// for(let x = 1; x < xCount; x+=2){
		// 	for(let y = 1; y < yCount; y+=2){
		// 		for(let z = 1; z < zCount; z+=2){
		// 			positions.push( (x - xCount/2)*10 );
		// 			positions.push( (y - yCount/2)*10 );
		// 			positions.push( (z - zCount/2)*10 );
		// 		}
		// 	}
		// }


		function mapping (value, x1, y1, x2, y2) {
			return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
		}

		// Setup sphere grid
		// const total = Math.sqrt(PARTICLES);
		// const sphereRadius = 100;
		// for (let i=0; i<total; i++) {
		// 	var theta = mapping(i, 0, total, -Math.PI, Math.PI);
		// 	for (let j=0; j<total; j++) {
		// 		var phi=mapping(j, 0, total, -Math.PI*0.5, Math.PI*0.5);
		// 		positions.push(sphereRadius*Math.sin(theta)*Math.cos(phi));
		// 		positions.push(sphereRadius*Math.sin(theta)*Math.sin(phi));
		// 		positions.push(sphereRadius*Math.cos(theta));	  
		// 	}
		// }


		// Setup shader particles colors and sizes
		for (var i = 0; i<PARTICLES; i++){
			//const hexColor = parseInt(Math.random()*traits.colorPallete.length)
			//color.setHSL( i/PARTICLES*100, 1, 0.5 )
			//color.setHex( 0xFFFFFF);
			color.setRGB(imageRed[i], imageGreen[i], imageBlue[i])
			colors.push( color.r, color.g, color.b );
			//array with size of each particle
			sizes.push( PARTICLESIZE );
		}

		console.log(imageBlue)

		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
		geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );
		geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

		// Setup custom material
		const uniforms = {
			pointTexture: { value: new THREE.TextureLoader().load(texture1) },
			u_time: {value: 1.0},
			u_mousex: {value: 1.0},
			u_mousey: {value: 1.0},
			u_width: canvasSize[0],
			u_height: canvasSize[1],
			u_size: {value: 1.0},
			u_offset: {value: traits.offset}
		};

		const shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			//blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true
		} );

		// Setup mesh
		const particleSystem = new THREE.Points( geometry, shaderMaterial);
		scene.add( particleSystem );

		// Setup lights
		const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
		const light = new THREE.PointLight( 0xff0000, 1, 100 );
		light.position.set( 50, 50, 50 );
		light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
		scene.add( light );

		// Setup camera
		const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.z = zoom;

		// Setup renderer / canvas
		const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true, alpha:true});
		renderer.domElement.setAttribute('id', props.id);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( canvasSize[0], canvasSize[1] );
		//renderer.autoClearColor = false;

		// Setup orbit Controls for camera
		var OrbitControls = require('three-orbit-controls')(THREE)
		var controls = new OrbitControls(camera, renderer.domElement )
		controls.autoRotate = true;
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

			shaderMaterial.uniforms.u_time.value = frameCount*0.005;
			//shaderMaterial.uniforms.u_mousex.value = mouseX*0.01;
			//shaderMaterial.uniforms.u_mousey.value = mouseY*0.01;
			shaderMaterial.uniforms.u_size.value = volume;

			if(exportVideo === true){
				if(frameCount>startFrame && frameCount<endFrame){
					ExportImage(frameCount);
				}
			}

			camera.rotateX = 1000*Math.sin(frameCount*0.01)
			camera.rotateY = 1000*Math.sin(frameCount)
			camera.rotateZ = 1000*Math.sin(frameCount)
			//controls.zoom = 1000*Math.sin(frameCount)
			controls.update()

			renderer.render( scene, camera );
			requestAnimationFrame( animate );
			
			
		}

		animate()

		// window.setInterval(() => {
			
			
		// }, 1000);

		// Export canvas video when click on export video
		const buttonExport = document.getElementById("exporter2");
		buttonExport.onclick = function(){
			frameCount = -1
			exportVideo = true	
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

			three(imageRed, imageGreen, imageBlue)
		}
	});

	return (
		null
	)
}



