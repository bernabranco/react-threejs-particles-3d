const vertexShader = `

    attribute float size;
    varying vec3 vColor;
    uniform float u_time;
    uniform float u_mousex;
    uniform float u_mousey;
    uniform float u_width;
    uniform float u_height;
    uniform float u_size;


    varying float vnoise;
    varying vec3 cnoise;

   


    //NOISE 3D
    //https://github.com/ashima/webgl-noise/blob/master/src/noise3D.glsl

    vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+10.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
    return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v)
    { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    //CURL NOISE

    vec3 snoiseVec3( vec3 x ){

      float s  = snoise(vec3( x ));
      float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;
    
    }

    vec3 curlNoise( vec3 p ){
  
      const float e = .1;
      vec3 dx = vec3( e   , 0.0 , 0.0 );
      vec3 dy = vec3( 0.0 , e   , 0.0 );
      vec3 dz = vec3( 0.0 , 0.0 , e   );
    
      vec3 p_x0 = snoiseVec3( p - dx );
      vec3 p_x1 = snoiseVec3( p + dx );
      vec3 p_y0 = snoiseVec3( p - dy );
      vec3 p_y1 = snoiseVec3( p + dy );
      vec3 p_z0 = snoiseVec3( p - dz );
      vec3 p_z1 = snoiseVec3( p + dz );
    
      float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    
      const float divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );
    
    }

     
  void main() {

    vColor = color;
    vec4 newPosition = vec4( position, 1. );
    
    float speed = 0.3;
    float time = u_time * speed;

    vnoise = snoise(newPosition.xyz + time);
    cnoise = curlNoise(newPosition.xyz + time);

    float soundOffset = 1.;

    //change size of vertex
    //float soundSize = size+u_size*sin(newPosition.x);
    gl_PointSize = size;
    //gl_PointSize = 2.0+1.0*(distance(vec2(0,0), newPosition.xy*0.03-15.));

    //change position of vertex
    //newPosition.x += 1.0*noise(newPosition.y*0.01+time);
    //newPosition.y += 1.0*noise(newPosition.x*0.01+time);
    //newPosition.z += 1.0*noise(newPosition.z*0.01+time);

    //perfect square
    //newPosition.x = 50.0*sin(newPosition.x+time);
    //newPosition.y = 50.0*sin(newPosition.y+time);
    //newPosition.z = 50.0*sin(newPosition.z+time);

    //heart line
    //newPosition.x = -25.+50.0*noise(newPosition.y*1.22+time);
    //newPosition.y = -25.+50.0*noise(newPosition.x*0.22+time);
    //newPosition.z = 5.0*sin(newPosition.z+time);

    //noise1d
    for(float i = 0.; i<10.; i++){
      //newPosition.x += 50.0*sin(newPosition.y*0.02*i + newPosition.x*0.01 + time*0.01);
      //newPosition.y += 1.0*sin(newPosition.x*0.01*i + time*0.01);
      //newPosition.z = 0.0;
    }
   

    //simples noise
    //newPosition.x += 100.0*snoise(newPosition.yyy*0.01 + time*0.2);
    //newPosition.y += 0.0*snoise(newPosition.xxx*0.02 + time*0.1);
    //newPosition.z += 0.0*snoise(newPosition.zzz*0.02 + time*0.1);

    //newPosition.x += 30.0*snoise((newPosition.xyz*0.01*u_mousex+time) + time);
    //newPosition.y += 30.0*snoise(newPosition.zyx*0.001*u_mousey + time);;
    //newPosition.z += 30.0*snoise(newPosition.xzy*0.01*u_mousey + time);

    //newPosition.x += 550.0*soundOffset*snoise(newPosition.xyz*0.001*u_offsetX + time);
    //newPosition.y += 550.0*soundOffset*snoise(newPosition.xyz*0.001*u_offsetY + time);;
    //newPosition.z += 550.0*soundOffset*snoise(newPosition.xzy*0.001*u_offsetZ + time);

    //newPosition.xyz += 150.0*curlNoise(newPosition.xyz*0.002 + newPosition.xyz*0.0000*u_size  + u_offsetX + time ).xyz;
    //newPosition.xyz += 50.0*curlNoise(newPosition.xyz*0.05 + u_offsetX + time).xyz;
    newPosition.xyz += 10.0*curlNoise(newPosition.xyz*0.01 + time);

    //newPosition.xyz += 500.0*snoise(newPosition.xyz*0.002 + u_offsetX + time);
    //newPosition.xyz += 550.0*curlNoise(newPosition.xyz*0.001 + u_offsetX);
    //newPosition.xyz += 1550.0*snoise(newPosition.xyz*0.001 + u_offsetX);

    //newPosition.y += 50.0*curlNoise(newPosition.zyx*0.02 + time);
    //newPosition.z += 50.0*curlNoise(newPosition.yzx*0.03 + time);

    //sphere grid
    
      //float dist = distance(vec2(0,0),newPosition.xy);
      //if(dist < 100.0){
        //newPosition.xyz += 150.*curlNoise(newPosition.xyz*0.005 + u_offsetX+time);  
      //}
     
    
    
    vec4 mvPosition = modelViewMatrix * newPosition;

    gl_Position = projectionMatrix * mvPosition;

  }
`

export {vertexShader};
