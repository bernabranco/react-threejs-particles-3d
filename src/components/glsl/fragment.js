const fragmentShader = `

uniform sampler2D pointTexture;
varying vec3 vColor;
varying float vnoise;
varying vec3 cnoise;

uniform float u_time;

vec3 hueShift(vec3 color, float hue)
{
const vec3 k = vec3(0.57735, 0.57735, 0.57735);
float cosAngle = cos(hue);
return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {

  // mudar cor das particulas
  vec3 color = vColor;
  //vec3 color = vec3(1,1,1);

  // color.r += vnoise;
  // color.g += vnoise;
  // color.b += vnoise;

  //color = hueShift(color, u_time*10.);
  gl_FragColor = vec4( color, 1.0 );
  //gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}

`

export {fragmentShader};
