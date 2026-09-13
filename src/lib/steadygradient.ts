/* The Steady gradient: ember, sand and lilac moving slowly over ink. Plain WebGL,
   no dependencies. Same shader as the brand kit and the app. mode: ribbon (waves
   over ink), field (soft full-bleed), flow (pure colour), vivid (the logo's hot
   setting). Speed can change every frame without the picture jumping. */
const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FS = `precision highp float;uniform vec2 R;uniform float T,MODE,SEED;
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
  float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){vec2 uv=gl_FragCoord.xy/R;float asp=R.x/R.y;vec2 q=(uv-.5)*vec2(asp,1.);
    float t=T*.4+SEED;
    // rotate 50deg like the reference plane
    float a=radians(-22.);mat2 rot=mat2(cos(a),-sin(a),sin(a),cos(a));vec2 r=rot*q;
    float n1=snoise(vec3(r.x*.85,r.y*1.7,t*.3));
    float n2=snoise(vec3(r.x*.45+3.1,r.y*.9,t*.18+7.));
    float f=n1*.6+n2*.4; // -1..1
    vec3 ember=vec3(1.,.314,.02),sand=vec3(.859,.729,.584),lilac=vec3(.816,.737,.882),ink=vec3(.039,.039,.043);
    float k=f*.5+.5; if(MODE>2.5){ember=vec3(1.,.22,0.);sand=vec3(1.,.72,.25);lilac=vec3(.72,.5,1.);}
    vec3 col=mix(ember,sand,smoothstep(.34,.5,k));col=mix(col,lilac,smoothstep(.52,.72,k));
    // wave ribbon: black plane seen edge-on, waves displace it
    float band=1.;
    if(MODE<.5){float edge=r.y*2.6+f*.55;band=smoothstep(1.05,.55,abs(edge));
      float glow=smoothstep(1.9,.9,abs(edge))*.16;col=mix(ink,col*1.04,band)+col*glow;}
    else if(MODE>2.5){float l=dot(col,vec3(.3,.59,.11));col=mix(vec3(l),col,1.45)*1.12;} else if(MODE>1.5){col*=1.02;} else {col=mix(col,ink,smoothstep(.55,1.5,length(q)))*1.02;}
    float g=(hash(gl_FragCoord.xy+fract(T)*13.)-.5)*.045;col+=g;
    gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;

const MODES = { ribbon: 0, field: 1, flow: 2, vivid: 3 } as const;
export type GradientMode = keyof typeof MODES;

export function startGradient(
  c: HTMLCanvasElement,
  { mode = "ribbon", seed = 0, speed = 1, still }: { mode?: GradientMode; seed?: number; speed?: number; still?: number } = {},
) {
  const gl = c.getContext("webgl", { antialias: false });
  if (!gl) return null;
  const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const p = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, "R"), uT = gl.getUniformLocation(pr, "T"), uM = gl.getUniformLocation(pr, "MODE"), uS = gl.getUniformLocation(pr, "SEED");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() { const w = c.clientWidth || c.width, h = c.clientHeight || c.height; c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); gl!.viewport(0, 0, c.width, c.height); }
  size(); window.addEventListener("resize", size);
  function draw(t: number) { gl!.uniform2f(uR, c.width, c.height); gl!.uniform1f(uT, t); gl!.uniform1f(uM, MODES[mode]); gl!.uniform1f(uS, seed); gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4); }
  let raf = 0, acc = 0, last = performance.now(), sp = speed;
  if (still !== undefined) { draw(still); }
  else {
    const loop = () => { const now = performance.now(); acc += ((now - last) / 1000) * sp; last = now; draw(acc); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
  }
  return {
    setSpeed(v: number) { sp = v; },
    stop() { cancelAnimationFrame(raf); window.removeEventListener("resize", size); },
  };
}
