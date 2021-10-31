const fragmentShader = `

uniform sampler2D pointTexture;
varying vec3 vColor;
varying float vnoise;
varying vec3 cnoise;

uniform float u_time;

void main() {

  vec3 color = vColor;
  //vec3 color = vec3(1,1,1);

  //color.r *= vnoise;
  //color.g *= vnoise;
  //color.b *= vnoise;

  gl_FragColor = vec4( color, 1.0 );
  gl_FragColor = 100.0*gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}

`

export {fragmentShader};
