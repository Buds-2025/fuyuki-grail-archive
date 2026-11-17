import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const vec = (x,y,z)=>new T.Vector3(x,y,z);
const clamp = T.MathUtils.clamp;
const polar = (r,a,y)=>vec(r*Math.sin(a),y,r*Math.cos(a));
const rseed = seed => () => ((seed=(Math.imul(seed,1664525)+1013904223)>>>0) / 4294967296);

function studio(renderer){
  const c=document.createElement('canvas');c.width=1024;c.height=512;
  const p=c.getContext('2d');p.fillStyle='#292323';p.fillRect(0,0,1024,512);
  for(const [x,y,w,h,core,edge] of [[240,170,83,117,'#fff8e9','#5e3929'],[587,200,55,144,'#ffe3b0','#633323'],[810,110,94,43,'#fffdfa','#69594c'],[970,310,87,75,'#a47c54','#392321'],[370,340,98,99,'#8e4929','#452722']]){
    const g=p.createRadialGradient(x,y,1,x,y,Math.max(w,h)*1.8);g.addColorStop(0,core);g.addColorStop(.35,core);g.addColorStop(.65,edge);g.addColorStop(1,'#29232300');p.fillStyle=g;p.fillRect(x-w*2.4,y-h*2.4,w*4.8,h*4.8);
    p.fillStyle=core;p.globalAlpha=.7;p.fillRect(x-w*.35,y-h*.5,w*.7,h);p.globalAlpha=1;
  }
  const tex=new T.CanvasTexture(c);tex.mapping=T.EquirectangularReflectionMapping;tex.colorSpace=T.SRGBColorSpace;
  const pm=new T.PMREMGenerator(renderer);const env=pm.fromEquirectangular(tex);
  tex.dispose();pm.dispose();return env;
}

function metalFinish() {
  const width=1024, height=512, random=rseed(371);
  function canvas() {
    const image=document.createElement('canvas');
    image.width=width;
    image.height=height;
    return image.getContext('2d');
  }
  function field(columns, rows) {
    const grid=Float32Array.from({length:columns*rows},random);
    return (x,y)=>{
      const u=x*columns/width, v=y*rows/height;
      const i=Math.floor(u), j=Math.floor(v), fx=u-i, fy=v-j;
      const tx=fx*fx*(3-2*fx), ty=fy*fy*(3-2*fy);
      const next=(i+1)%columns, top=j*columns, bottom=((j+1)%rows)*columns;
      const a=T.MathUtils.lerp(grid[top+i],grid[top+next],tx);
      const b=T.MathUtils.lerp(grid[bottom+i],grid[bottom+next],tx);
      return T.MathUtils.lerp(a,b,ty);
    };
  }
  const stain=field(13,8), mottle=field(39,24), pores=field(180,97);
  const marks=canvas();
  marks.fillStyle='#808080';
  marks.fillRect(0,0,width,height);
  for(let i=0;i<1750;i++) {
    const x=random()*width, y=random()*height, size=1.6+random()*6.2;
    const dent=marks.createRadialGradient(x,y,0,x,y,size);
    dent.addColorStop(0,'#0006');
    dent.addColorStop(.6,'#0002');
    dent.addColorStop(1,'#0000');
    marks.fillStyle=dent;
    marks.fillRect(x-size,y-size,2*size,2*size);
  }
  for(let i=0;i<590;i++) {
    const x=random()*width, y=random()*height, length=3+random()**2*38;
    const offset=(random()-.45)*length*(i%5===0?.84:.15);
    marks.strokeStyle=i%4===0?'#fff5':'#20100655';
    marks.lineWidth=.35+random()*.65;
    for (const shift of [0,-width]) {
      marks.beginPath();
      marks.moveTo(x+shift,y);
      marks.quadraticCurveTo(x+shift+length*.46,y+offset*.65,x+shift+length,y+offset);
      marks.stroke();
    }
  }
  const relief=marks.getImageData(0,0,width,height).data;
  const patina=canvas(), surface=canvas();
  const color=patina.createImageData(width,height), properties=surface.createImageData(width,height);
  for(let y=0;y<height;y++) {
    for(let x=0;x<width;x++) {
      const k=(y*width+x)*4;
      const cloud=stain(x,y), grain=mottle(x,y), pore=pores(x,y);
      const wear=(relief[k]-128)/128;
      const age=T.MathUtils.smoothstep(cloud*.62+grain*.38,.29,.74);
      const variation=(pore-.5)*15+wear*42;
      color.data[k]=198-93*age+variation;
      color.data[k+1]=158-78*age+variation;
      color.data[k+2]=104-51*age+variation;
      color.data[k+3]=255;
      // Three.js reads height from red, roughness from green and metalness from blue.
      properties.data[k]=151+(grain-.5)*38+(pore-.5)*31+wear*108;
      properties.data[k+1]=128+75*age+14*(pore-.5)-Math.max(0,wear)*43;
      properties.data[k+2]=243-48*age;
      properties.data[k+3]=255;
    }
  }
  patina.putImageData(color,0,0);
  surface.putImageData(properties,0,0);
  const map=new T.CanvasTexture(patina.canvas), finish=new T.CanvasTexture(surface.canvas);
  map.colorSpace=T.SRGBColorSpace;
  for(const texture of [map,finish]) {
    texture.wrapS=T.RepeatWrapping;
    texture.anisotropy=4;
  }
  return {map,bumpMap:finish,roughnessMap:finish,metalnessMap:finish};
}

function vessel(){
  const group=new T.Group(), finish=metalFinish();
  const metal=(color,metalness,roughness,bumpScale)=>new T.MeshStandardMaterial({
    ...finish,color,metalness,roughness,bumpScale,envMapIntensity:1.19
  });
  const gold=metal(0xe8d8bf,.94,.95,.041);
  gold.vertexColors=true;
  const edge=metal(0xfff0d6,.98,.77,.024);
  const relief=metal(0xd8c4a6,.9,.88,.016);
  const inset=metal(0x9b866e,.82,1.12,.034);
  const interior=metal(0xbca98b,.87,1.04,.032);
  const mesh=(geo,mat)=>{const m=new T.Mesh(geo,mat);group.add(m);return m;};
  function lathe(profile,mat=gold){
    const geometry=new T.LatheGeometry(profile.map(point=>new T.Vector2(...point)),128);
    const uv=geometry.getAttribute('uv');
    const lengths=[0];
    for(let i=1;i<profile.length;i++) {
      lengths.push(lengths[i-1]+Math.hypot(profile[i][0]-profile[i-1][0],profile[i][1]-profile[i-1][1]));
    }
    const tones=[];
    for(let i=0;i<uv.count;i++) {
      const row=i%profile.length;
      uv.setY(i,lengths[row]/lengths.at(-1));
      if(mat!==gold) continue;
      const y=profile[row][1], angle=uv.getX(i)*TAU;
      const groove=.15*Math.exp(-((y-2.67)**2)/.002)+.21*Math.exp(-((y-1.51)**2)/.009);
      const rub=.08*Math.cos(7*angle+y*4)+.05*Math.sin(13*angle-y*7);
      const tone=clamp(.87-groove+rub,.58,1);
      tones.push(tone,tone,tone);
    }
    if(mat===gold) geometry.setAttribute('color',new T.Float32BufferAttribute(tones,3));
    return mesh(geometry,mat);
  }
  function ring(r,y,d,mat=edge){const m=mesh(new T.TorusGeometry(r,d,8,104),mat);m.rotation.x=Math.PI*.5;m.position.y=y;return m;}
  function line(points,r,collector){collector.push(new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(6,points.length*2),r,5,false));}
  function dots(point, size, collector){const d=new T.IcosahedronGeometry(size,1);d.translate(...point.toArray());collector.push(d);}
  function weld(list,material){if(!list.length)return;const geo=mergeGeometries(list.map(x=>x.index?x.toNonIndexed():x));mesh(geo,material);for(const x of list)x.dispose();}

  // Closed profile: under the bowl, over the lip, then down the interior.
  const bowl=[[.0,1.51],[.19,1.51],[.32,1.53],[.43,1.58],[.55,1.65],[.68,1.77],[.79,1.91],[.89,2.08],[.96,2.26],[1.01,2.42],[1.04,2.57],[1.09,2.69],[1.12,2.72],[1.12,2.76],[1.09,2.78],[1.03,2.78],[1.005,2.744],[.99,2.65],[.96,2.51],[.91,2.33],[.84,2.14],[.75,1.97],[.65,1.83],[.53,1.74],[.37,1.68],[.18,1.65],[0,1.645]];
  lathe(bowl);
  lathe([[0,0],[.53,0],[.66,.016],[.724,.055],[.735,.10],[.71,.139],[.655,.156],[.633,.20],[.58,.247],[.52,.275],[.44,.286],[.36,.32],[.30,.37],[.255,.45],[.226,.56],[.212,.67],[.205,.77],[.218,.84],[.267,.9],[.288,.959],[.268,1.022],[.225,1.07],[.196,1.12],[.198,1.23],[.228,1.31],[.296,1.37],[.333,1.41],[.331,1.46],[.279,1.52],[0,1.55]]);
  for(const [r,y,d] of [[.716,.07,.021],[.69,.146,.016],[.575,.239,.014],[.379,.309,.013],[.259,.448,.012],[.259,.877,.018],[.283,.947,.017],[.272,1,.014],[.218,1.09,.014],[.316,1.378,.018],[.332,1.454,.018],[.415,1.569,.012],[.60,1.697,.012],[.89,2.078,.011],[1.028,2.495,.014],[1.041,2.545,.012],[1.076,2.659,.015],[1.118,2.739,.023],[1.102,2.775,.015]])ring(r,y,d);
  lathe([[1.015,2.46],[1.026,2.486],[1.039,2.556],[1.06,2.624],[1.079,2.65]],inset);
  lathe([[.669,.11],[.704,.119],[.705,.132],[.665,.142]],inset);
  lathe([[.167,1.656],[.34,1.662],[.53,1.712],[.62,1.78],[.58,1.824],[.44,1.751],[.28,1.714],[.10,1.694],[0,1.685]],interior);
  ring(.43,1.723,.011,edge);ring(.23,1.677,.009,edge);

  const ribs=[], dark=[], rivets=[];
  for(let i=0;i<32;i++){
    const a=i*TAU/32;
    line([[.31,1.547],[.431,1.59],[.62,1.713],[.78,1.895],[.887,2.08]].map(([r,y])=>polar(r+.009,a,y)),.009,ribs);
    line([[.27,.395],[.231,.506],[.22,.59],[.218,.687],[.228,.809]].map(([r,y])=>polar(r+.004,a,y)),.007,ribs);
    dots(polar(1.062,a,2.611),.024,rivets);
    dots(polar(.702,a,.142),.015,rivets);
  }
  for(let i=0;i<12;i++){
    const a=i*TAU/12;
    const rFor=y=>.912+(y-2.13)*.31;
    const loops=[];
    for(let j=0;j<=16;j++){const t=j*TAU/16,y=2.29+.141*Math.cos(t),phi=.107*Math.sin(t)*(1-.3*Math.cos(2*t));loops.push(polar(rFor(y)+.008,a+phi,y));}
    line(loops,.012,ribs);
    for(const k of [-1,1]){
      const leaf=[[.025,2.18],[.056,2.22],[.062,2.27],[.037,2.30],[.052,2.34],[.083,2.367]].map(([x,y])=>polar(rFor(y)+.012,a+k*x,y));
      line(leaf,.005,ribs);
    }
    line([[0,2.21],[0,2.28],[0,2.37]].map(([b,y])=>polar(rFor(y)+.009,a+b,y)),.007,dark);
    dots(polar(rFor(2.29)+.019,a,2.29),.024,rivets);
    for(let k=0;k<3;k++){const b=a+(k-1)*.103;line([[.39,.313],[.45,.287],[.54,.269],[.61,.232],[.65,.18]].map(([r,y])=>polar(r+.008,b+(y-.245)*.28,y)),.007,ribs);}
  }
  weld(ribs,relief);weld(dark,inset);weld(rivets,relief);
  group.position.y=-1.37;return group;
}

function particles(scene){
  const rnd=rseed(1744), p=[], colors=[];
  for(let i=0;i<210;i++){
    const a=rnd()*TAU, r=1.15+rnd()*2.7;
    p.push(Math.sin(a)*r,(rnd()-.49)*5,Math.cos(a)*r*.7);
    const c=new T.Color(i%7===0?0xc57056:0xf9c176).multiplyScalar(.37+rnd()*.59);colors.push(c.r,c.g,c.b);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');const grad=ctx.createRadialGradient(32,32,1,32,32,31);grad.addColorStop(0,'#fff');grad.addColorStop(.22,'#fff9');grad.addColorStop(.55,'#fff2');grad.addColorStop(1,'#fff0');ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);
  const m=new T.PointsMaterial({map:new T.CanvasTexture(c),size:.06,vertexColors:true,transparent:true,opacity:.69,depthWrite:false,blending:T.AdditiveBlending});
  const points=new T.Points(g,m);scene.add(points);return points;
}

function ritualSparks(scene, pixelRatio) {
  const random = rseed(2049);
  const positions = [], attributes = [];
  for (let i=0; i<340; i++) {
    const ember = i < 120;
    positions.push((random()-.5)*7.1, random(), (random()-.5)*3.9);
    attributes.push(random(), .18+random()*.58, .2+random()*.8, ember ? 1 : 0);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aVariation', new T.Float32BufferAttribute(attributes, 4));
  const uniforms = { uTime:{value:0}, uPixelRatio:{value:pixelRatio} };
  const material = new T.ShaderMaterial({
    uniforms, transparent:true, depthWrite:false, blending:T.AdditiveBlending,
    vertexShader:`
      uniform float uTime;
      uniform float uPixelRatio;
      attribute vec4 aVariation;
      varying float vLife;
      varying float vEmber;
      varying float vSize;
      void main(){
        vEmber=aVariation.w;
        float phase=fract(position.y+uTime*aVariation.y*.105);
        float height=mix(4.85,3.05,vEmber);
        vec3 p=position;
        p.y=phase*height-1.84;
        p.x=p.x+sin(phase*6.0+aVariation.x*28.0)*.28;
        p.z=p.z+cos(phase*4.5+aVariation.x*20.0)*.18;
        vec4 viewPosition=modelViewMatrix*vec4(p,1.0);
        vLife=smoothstep(0.0,.18,phase)*(1.0-smoothstep(.64,1.0,phase));
        vLife*=.58+.42*sin(uTime*(1.5+aVariation.x*3.5)+aVariation.x*47.0);
        vSize=aVariation.z;
        gl_Position=projectionMatrix*viewPosition;
        gl_PointSize=clamp((1.0+aVariation.z*6.7+vEmber*2.6)*uPixelRatio*5.0/-viewPosition.z,1.0,20.0);
      }`,
    fragmentShader:`
      varying float vLife;
      varying float vEmber;
      varying float vSize;
      void main(){
        vec2 p=gl_PointCoord-.5;
        float r=length(vec2(p.x*(1.0+vEmber*.45),p.y));
        float kernel=exp(-r*r*21.0)*(1.0-smoothstep(.25,.51,r));
        float core=exp(-r*r*90.0);
        vec3 gold=vec3(1.0,.64,.29);
        vec3 red=vec3(1.0,.22,.10);
        vec3 color=mix(gold,red,vEmber)+core*.38;
        gl_FragColor=vec4(color,(kernel*.54+core*.46)*vLife*(.37+vSize*.45));
      }`
  });
  const sparks = new T.Points(geometry,material);
  sparks.frustumCulled=false;
  scene.add(sparks);
  return { sparks, uniforms };
}

function exhibitLights(scene) {
  const light=(color,intensity,pos)=>{const l=new T.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);return l;};
  light(0xfff0da,3.6,[-4,5,4]);
  light(0xffcf9d,1.9,[4,1,-3]);
  light(0xe9eef7,1.55,[3,2,5]);
  light(0xf6e8cd,.84,[-2,-1,5]);
  const redRim=light(0xdd3a34,.33,[-3,-1,1]);
  const sideGlow=new T.PointLight(0xe43b29,1.37,5);
  sideGlow.position.set(.74,-1.61,.55);
  scene.add(sideGlow);
  return {redRim,sideGlow};
}

export function mountScene(wrap,onSelect,onAvailability){
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  renderer.domElement.setAttribute('aria-hidden','true');wrap.append(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,70);
  camera.position.set(0,.53,6.05);camera.lookAt(0,.05,0);
  let environment=studio(renderer);
  scene.environment=environment.texture;
  const {redRim,sideGlow}=exhibitLights(scene);
  const pivot=new T.Group();const cup=vessel();pivot.add(cup);scene.add(pivot);
  const dust=particles(scene);
  const { sparks, uniforms } = ritualSparks(scene,renderer.getPixelRatio());
  let effects=!reduced.matches, elapsed=0, spin=false, yaw=-.27, tilt=.10, zoom=1;
  let visible=true, canDraw=true, raf=0;
  const pointers=new Map(),ray=new T.Raycaster();
  let pinch=0,moved=0,usedMultiplePointers=false,last=0;
  const sync=()=>{
    const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();queue();
  };
  const res=new ResizeObserver(sync);res.observe(wrap);
  const obs=new IntersectionObserver(([r])=>{visible=r.isIntersecting;if(visible)queue();});obs.observe(wrap);
  const step=(now)=>{
    raf=0;if(!visible||!canDraw||document.hidden)return;
    const dt=last?Math.min(48,now-last):16;last=now;
    if(spin){yaw+=.00048*dt;dust.rotation.y+=.000055*dt;}
    sparks.visible=effects;
    if(effects) elapsed+=dt/1000;
    uniforms.uTime.value=elapsed;
    sideGlow.intensity=effects ? 1.55+Math.sin(elapsed*.85)*.34 : 1.37;
    redRim.intensity=effects ? .39+.08*Math.sin(elapsed*.66) : .33;
    applyView();
    renderer.render(scene,camera);
    if(spin||effects)queue();
  };
  function queue(){if(!raf&&visible&&canDraw&&!document.hidden)raf=requestAnimationFrame(step);}
  function applyView() {
    pivot.rotation.set(tilt,yaw,0,'YXZ');
    if (camera.zoom !== zoom) {
      camera.zoom=zoom;
      camera.updateProjectionMatrix();
    }
  }
  function scale(mult){
    const next = clamp(zoom*mult,.72,1.48);
    if (next === zoom) return false;
    zoom = next;
    queue();
    return true;
  }
  function select(e){
    const b=renderer.domElement.getBoundingClientRect();
    if (!b.width || !b.height || e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) return;
    applyView();
    pivot.updateMatrixWorld(true);
    ray.setFromCamera(new T.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),camera);
    if(ray.intersectObject(cup,true).length)onSelect();
  }
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{
    if (!canDraw || e.button !== 0 || pointers.size >= 2) return;
    if (!pointers.size) {
      moved=0;
      usedMultiplePointers=false;
    } else {
      usedMultiplePointers=true;
    }
    pointers.set(e.pointerId,[e.clientX,e.clientY]);
    canvas.setPointerCapture(e.pointerId);
    if(pointers.size===2){const [a,b]=pointers.values();pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}
  });
  canvas.addEventListener('pointermove',e=>{
    const old=pointers.get(e.pointerId);if(!old)return;
    const x=e.clientX-old[0],y=e.clientY-old[1];moved+=Math.hypot(x,y);pointers.set(e.pointerId,[e.clientX,e.clientY]);
    if(pointers.size===1){yaw+=x*.009;tilt=clamp(tilt+y*.008,-.59,.81);queue();}
    else if(pointers.size===2){const [a,b]=pointers.values();const size=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch>5)scale(size/pinch);pinch=size;}
  });
  function release(e) {
    const previous=pointers.get(e.pointerId);
    if(!previous) return;
    const distance=moved+Math.hypot(e.clientX-previous[0],e.clientY-previous[1]);
    pointers.delete(e.pointerId);
    pinch=0;
    if (e.type==='pointerup' && !usedMultiplePointers && distance<7) select(e);
  }
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('wheel', e=>{
    if (!canDraw || e.ctrlKey || e.metaKey) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? wrap.clientHeight : 1;
    const distance = clamp(e.deltaY*unit,-130,130);
    if (scale(Math.exp(-distance*.002))) e.preventDefault();
  }, {passive:false});
  wrap.addEventListener('keydown',e=>{
    if (!canDraw || e.ctrlKey || e.metaKey || e.altKey) return;
    switch(e.key){case 'ArrowLeft':yaw-=.2;break;case 'ArrowRight':yaw+=.2;break;case 'ArrowUp':tilt=clamp(tilt-.15,-.59,.81);break;case 'ArrowDown':tilt=clamp(tilt+.15,-.59,.81);break;case '+':case '=':scale(1.16);break;case '-':scale(1/1.16);break;case 'Enter':case ' ':onSelect();break;default:return;}
    e.preventDefault();queue();
  });
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();
    canDraw=false;
    pointers.clear();
    pinch=0;
    if (raf) cancelAnimationFrame(raf);
    raf=0;
    onAvailability(false);
    reportEffects();
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    try {
      environment.dispose();
      environment=studio(renderer);
      scene.environment=environment.texture;
    } catch (error) {
      console.warn('WebGL exhibit could not restore its lighting:',error.message);
      return;
    }
    canDraw=true;
    last=0;
    sync();
    onAvailability(true);
    reportEffects();
  });
  function reportEffects() {
    wrap.closest('.stage').classList.toggle('effects-running',canDraw&&effects);
    document.querySelector('[data-action="effects"]').setAttribute('aria-pressed',canDraw&&effects);
    document.querySelector('[data-action="spin"]').setAttribute('aria-pressed',canDraw&&spin);
  }
  document.addEventListener('visibilitychange',queue);
  reduced.addEventListener('change',()=>{
    if(reduced.matches){spin=false;effects=false;}
    reportEffects();queue();
  });
  reportEffects();
  sync();onAvailability(true);
  return {
    command(action){
      if (!canDraw) return;
      if(action==='in')scale(1.16);
      if(action==='out')scale(1/1.16);
      if(action==='spin')spin=!spin;
      if(action==='effects')effects=!effects;
      if(action==='reset'){yaw=-.27;tilt=.10;zoom=1;spin=false;}
      reportEffects();queue();
    }
  };
}
