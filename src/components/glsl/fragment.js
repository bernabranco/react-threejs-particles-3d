const fragmentShader = `

uniform sampler2D pointTexture;
varying vec3 vColor;
varying vec4 newPosition;
varying vec3 cnoise;

uniform float u_time;

vec3 hueShift(vec3 color, float hue)
{
const vec3 k = vec3(0.57735, 0.57735, 0.57735);
float cosAngle = cos(hue);
return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {

  vec3 noise = cnoise;
  vec3 color = vColor * abs(noise);
  //change hue of pixel color
  //color = hueShift(color, u_time*10.);

  gl_FragColor = vec4( color, 1.0 );
  //gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}

`

export {fragmentShader};
