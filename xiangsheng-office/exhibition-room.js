import * as T from './vendor/three.module.js';
import {RoundedBoxGeometry} from './vendor/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from './vendor/addons/utils/BufferGeometryUtils.js';
import {SPACE_CONFIG} from './space-config.js';
export async function buildExhibition(renderer){
const scene=new T.Group();const notify=message=>console.warn(message);
const interiorLights=[],occluders=[],selectable=[],instances=[],templates=[],ceilings=new T.Group(),obstacles=[];scene.add(ceilings);
const materialCache=new Map();
const material=(color,roughness=.65,metalness=0)=>{const key=[color,roughness,metalness].join('/');if(!materialCache.has(key))materialCache.set(key,new T.MeshStandardMaterial({color,roughness,metalness}));return materialCache.get(key);};
const M={wall:material('#a8a59f',.88),ivory:material('#e5e1d7',.38),front:material('#c9c7bf',.48),frame:material('#ddd9cf',.33,.12),slat:material('#7c7769',.85),dark:material('#292923',.7),wood:material('#2c251f',.4),metal:material('#68665c',.25,.82),brass:material('#aa9870',.32,.72),cream:material('#eeebe1',.27),glow:new T.MeshBasicMaterial({color:'#fff2ce'}),goldGlow:new T.MeshBasicMaterial({color:'#ffe4a5'}),glass:new T.MeshPhysicalMaterial({color:'#b3c5ca',roughness:.13,metalness:.18,transparent:true,opacity:.15,depthWrite:false})};
const geos=new Map();
function rounded(w,h,d,r=.008){const key=[w,h,d,r].join(',');if(!geos.has(key))geos.set(key,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/2,h/2,d/2)));return geos.get(key);}
function box(w,h,d,x,y,z,mat=M.ivory,parent=scene,r=.003,occlude=true){const mesh=new T.Mesh(r?rounded(w,h,d,r):new T.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);if(occlude&&parent===scene)occluders.push(mesh);return mesh;}
function lathe(points,mat,parent=scene){const key='lathe'+JSON.stringify(points);if(!geos.has(key))geos.set(key,new T.LatheGeometry(points.map(p=>new T.Vector2(...p)),48));const mesh=new T.Mesh(geos.get(key),mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);if(parent===scene)occluders.push(mesh);return mesh;}
function cylinder(r,h,x,y,z,mat,parent=scene){const key=`cyl${r},${h}`;if(!geos.has(key))geos.set(key,new T.CylinderGeometry(r,r,h,64));const mesh=new T.Mesh(geos.get(key),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function canvasTexture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return tex;}
function plane(w,h,x,y,z,mat,rotation=0,parent=scene){const mesh=new T.Mesh(new T.PlaneGeometry(w,h),mat);mesh.position.set(x,y,z);mesh.rotation.y=rotation;parent.add(mesh);return mesh;}
function words(text,w,h,x,y,z,opts={}){const tex=canvasTexture(1024,Math.round(1024*h/w),(c,cw,ch)=>{c.fillStyle=opts.bg||'#c9c7bf';c.fillRect(0,0,cw,ch);c.fillStyle=opts.color||'#565d4c';c.font=`500 ${opts.size||70}px "Microsoft YaHei",sans-serif`;c.textAlign='center';c.textBaseline='middle';const lines=text.split('\n');lines.forEach((l,i)=>c.fillText(l,cw/2,ch/2+(i-(lines.length-1)/2)*(opts.size||70)*1.4,cw-50));});return plane(w,h,x,y,z,new T.MeshBasicMaterial({map:tex}),opts.rotation||0,opts.parent||scene);}
const loader=new T.TextureLoader();
async function loadTexture(url,color=false,repeat=1){try{const tex=await loader.loadAsync(url);tex.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(repeat,repeat);tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return tex;}catch{notify('部分材质未加载，已使用基础材质。');return null;}}
const [carpetColor,carpetNormal,carpetRough]=await Promise.all([loadTexture('./assets/carpet-color.jpg',true,5),loadTexture('./assets/carpet-normal.jpg',false,5),loadTexture('./assets/carpet-rough.jpg',false,5)]);
const carpetMat=material('#cecbc4',.98);carpetMat.map=carpetColor;carpetMat.normalMap=carpetNormal;carpetMat.normalScale=new T.Vector2(.35,.35);carpetMat.roughnessMap=carpetRough;
carpetMat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nfloat gray=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=vec3(gray*.8+.12);');};
box(8.4,.14,6.5,0,-.06,0,carpetMat,scene,.01);
// The room follows the supplied 8.4 × 6.5 m floor plan, with a 2.55 m ceiling.
box(.15,2.55,6.5,-4.19,1.275,0,M.wall);
// Corridor opening: world X 17.35–18.75, retained from the supplied floor plan.
box(.45,2.55,.035,-3.975,1.275,-3.16,M.wall);box(6.35,2.55,.035,1.025,1.275,-3.16,M.wall);box(1.6,.37,.035,-2.95,2.365,-3.16,M.wall);
// Glazed southern partition: no opaque finish over the actual glass opening.
box(.5,2.55,.025,-3.95,1.275,3.15,M.wall);box(.3,2.55,.025,1.7,1.275,3.15,M.wall);box(5.25,.55,.025,-1.075,.275,3.15,M.wall);box(5.25,.37,.025,-1.075,2.365,3.15,M.wall);box(.75,2.55,.025,3.825,1.275,3.15,M.wall);box(1.6,.37,.025,2.65,2.365,3.15,M.wall);

box(.15,.64,6.5,4.27,.26,0,M.wall);box(.15,.28,6.5,4.27,2.46,0,M.wall);
// Skirting is supplied once by the office shell, outside the finished wall faces.
// Window frames, fine blinds and an illustrated distant skyline.
const skyline=canvasTexture(2048,768,(c,w,h)=>{const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#9caebe');sky.addColorStop(.65,'#e5d5c9');sky.addColorStop(1,'#cbd2d3');c.fillStyle=sky;c.fillRect(0,0,w,h);for(let layer=0;layer<3;layer++)for(let i=0;i<30;i++){const bw=30+(i*17%60),bh=50+(i*49%180)+(layer===2?70:0),x=i*80-20+(layer*37),y=h-bh-20;c.fillStyle=['#b4bdc4','#a5b2bc','#929fa9'][layer];c.fillRect(x,y,bw,bh);if(layer===2){for(let yy=y+12;yy<h-20;yy+=13)for(let xx=x+6;xx<x+bw-5;xx+=10){c.fillStyle=(xx+yy)%4?'#bfc7ca':'#e8d4b2';c.fillRect(xx,yy,4,6);}}}c.fillStyle='#bac5c6';c.fillRect(0,h-22,w,22);});
const skyMat=new T.MeshBasicMaterial({map:skyline,side:T.DoubleSide});
plane(6.5,2.4,4.42,1.35,0,skyMat,-Math.PI/2);
// Two distinct east windows, separated by the measured wall pier.
for(const window of[{z:-1.305,width:3.89},{z:2.365,width:1.77}]){const g=new T.Group();g.position.set(4.19,0,window.z);g.rotation.y=-Math.PI/2;scene.add(g);const w=window.width;box(w,.055,.11,0,.59,0,M.frame,g);box(w,.04,.11,0,2.30,0,M.frame,g);box(w+.03,.04,.32,0,.55,.06,M.front,g);for(const x of[-w/2,0,w/2])box(.04,1.76,.10,x,1.45,0,M.frame,g);plane(w,1.65,0,1.45,-.02,M.glass,0,g);for(let k=0;k<20;k++)box(w,.013,.035,0,2.27-k*.034,.055,material(k%2?'#373932':'#4c4d44'),g,.001,false);}
// Window-sill skirting has one exposed face, 18 mm proud of the finished sill.
M.dark.name='exhibition-trim';for(const w of[{z:-1.305,width:3.89},{z:2.365,width:1.77}]){const strip=box(.018,.10,w.width,4.186,.055,w.z,M.dark);strip.castShadow=false;}
// Structural wall piers: west 1.05 m long; east 0.84 m long.
box(.42,2.55,1.05,-3.99,1.275,1.095,M.wall);box(.30,2.55,.84,4.05,1.275,1.06,M.wall);obstacles.push({type:'box',x1:-4.2,x2:-3.78,z1:.57,z2:1.62},{type:'box',x1:3.9,x2:4.2,z1:.64,z2:1.48});
// Ceiling: recessed dark backing, slats, lighting channels and warm downlights.
box(8.55,.10,6.65,0,2.60,0,M.slat,ceilings,0);for(let z=-3.12;z<3.2;z+=.145)box(8.36,.085,.034,0,2.50,z,M.slat,ceilings,.002,false);
for(const x of[-3.05,3.05]){box(.21,.19,6.5,x,2.43,0,M.front,ceilings);box(.033,.018,6.22,x+.095,2.326,0,M.glow,ceilings,0);box(.05,.015,6.22,x-.09,2.33,0,M.cream,ceilings,0);}
for(const z of[-2.80,2.80]){box(8.4,.20,.35,0,2.43,z,M.front,ceilings);box(7.9,.02,.032,0,2.32,z+(z<0?.18:-.18),M.glow,ceilings,0);}
for(const x of[-2,0,2]){box(.50,.025,.23,x,2.44,0,M.dark,ceilings);for(const dx of[-.15,0,.15]){const lamp=cylinder(.045,.018,x+dx,2.42,0,M.glow,ceilings);lamp.castShadow=false;}}
// Door frame and leaf are supplied by the office scene.
// Soft baked-style occlusion maps keep the cabinet recesses readable.
const recessTexture=canvasTexture(256,256,(c,w,h)=>{const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#e7deca');grad.addColorStop(.13,'#cbc5b6');grad.addColorStop(.63,'#c8c3b7');grad.addColorStop(1,'#9b988e');c.fillStyle=grad;c.fillRect(0,0,w,h);const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#433d343b');g.addColorStop(.10,'#00000000');g.addColorStop(.90,'#00000000');g.addColorStop(1,'#433d343b');c.fillStyle=g;c.fillRect(0,0,w,h);});
const recessMat=new T.MeshBasicMaterial({map:recessTexture,color:'#c7c3b8'});
const radial=canvasTexture(256,256,(c,w,h)=>{const gr=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'rgba(0,0,0,.42)');gr.addColorStop(.55,'rgba(0,0,0,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(0,0,w,h);});
const shadowMat=new T.MeshBasicMaterial({map:radial,transparent:true,depthWrite:false,toneMapped:false});
function floorShadow(x,z,w,d,opacity=.8){const p=plane(w,d,x,.012,z,shadowMat.clone());p.rotation.x=-Math.PI/2;p.material.opacity=opacity;p.renderOrder=1;return p;}
const warmTexture=canvasTexture(128,128,(c,w,h)=>{const gr=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'rgba(255,224,162,.6)');gr.addColorStop(.6,'rgba(255,209,139,.2)');gr.addColorStop(1,'rgba(255,209,139,0)');c.fillStyle=gr;c.fillRect(0,0,w,h);});
const warmMat=new T.MeshBasicMaterial({map:warmTexture,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
function poolGlow(x,z,w,d,opacity=.3){const p=plane(w,d,x,.014,z,warmMat.clone());p.rotation.x=-Math.PI/2;p.material.opacity=opacity;p.renderOrder=2;return p;}
// Five identical four-tier cabinets, 1.20 × 2.20 × 0.30 m each.
const cabinet=SPACE_CONFIG.exhibition.cabinet,cabLeft=cabinet.left,cabWidth=cabinet.width,bay=cabWidth/cabinet.count,cabZ=cabinet.z,shelves=[.58,.98,1.38,1.78],wallProducts=[];
for(let i=0;i<cabinet.count;i++){
 const g=new T.Group();g.name='展厅四层柜 '+(i+1);g.position.set(cabLeft+bay*(i+.5),0,cabZ);scene.add(g);
 box(bay,.10,cabinet.depth,0,.05,0,M.dark,g);box(bay,.45,.276,0,.325,0,M.front,g);
 box(bay,.03,cabinet.depth,0,.565,0,M.ivory,g);box(bay,.04,cabinet.depth,0,2.18,0,M.frame,g);
 for(const x of[-bay/2+.015,bay/2-.015])box(.03,1.60,cabinet.depth,x,1.38,0,M.frame,g);
 box(bay-.06,1.60,.015,0,1.38,-.1425,M.front,g);
 for(const x of[-bay/4,bay/4]){box(bay/2-.018,.395,.018,x,.335,.141,M.front,g);box(.085,.009,.012,x,.505,.156,M.metal,g);}
 box(bay-.06,.012,.018,0,.105,.143,M.goldGlow,g);
 for(const y of shelves){plane(bay-.065,.365,0,y+.198,-.134,recessMat,0,g);box(bay-.06,.025,cabinet.depth,0,y,0,M.ivory,g);box(bay-.10,.008,.012,0,y+.371,.105,M.glow,g);box(bay-.06,.012,.02,0,y+.384,.118,M.frame,g);}
 g.traverse(o=>{if(o.isMesh)occluders.push(o);});
}
floorShadow(cabLeft+cabWidth/2,cabZ+.13,cabWidth+.10,.40,.45);poolGlow(cabLeft+cabWidth/2,cabZ+.17,cabWidth,.28,.12);
// Track spotlights paint warm pools above the cabinets; their heads have real depth.
box(cabWidth+.25,.025,.04,cabLeft+cabWidth/2,2.33,-2.73,M.metal,ceilings);for(let i=0;i<cabinet.count;i++){const x=cabLeft+bay*(i+.5);cylinder(.018,.08,x,2.27,-2.73,M.metal,ceilings);const head=cylinder(.042,.12,x,2.18,-2.70,M.ivory,ceilings);head.rotation.x=.45;const lens=cylinder(.033,.004,x,2.125,-2.67,M.glow,ceilings);lens.rotation.x=.45;const light=new T.SpotLight(0xffe6bd,4.2,4,.62,.85,2);light.position.set(x,2.16,-2.65);light.target.position.set(x,1.65,-3.23);scene.add(light,light.target);interiorLights.push(light);}
for(const x of[-2.2,.4,2.8]){const l=new T.PointLight(0xffefcf,1.8,5.5,2);l.position.set(x,1.65,-2.35);scene.add(l);interiorLights.push(l);}const roomFill=new T.PointLight(0xffedd4,10,10,2);roomFill.position.set(0,2.28,.5);scene.add(roomFill);interiorLights.push(roomFill);
// Rounded, two-tier islands leave a continuous central aisle.
const islandZ=SPACE_CONFIG.exhibition.islands.z,islandScale=SPACE_CONFIG.exhibition.islands.scale;
for(const x of SPACE_CONFIG.exhibition.islands.x){floorShadow(x,islandZ,2.8*islandScale,2.5*islandScale,.9);poolGlow(x,islandZ,2.85*islandScale,2.65*islandScale,.65);const base=lathe([[0,0],[1.01,0],[1.035,.02],[1.045,.06],[1.045,.31],[1.035,.33],[1.01,.34],[0,.34]],M.cream);base.position.set(x,.032,islandZ);base.scale.set(islandScale,1,islandScale);const top=lathe([[0,0],[.71,0],[.735,.02],[.735,.20],[.715,.225],[0,.225]],M.cream);top.position.set(x,.372,islandZ);top.scale.set(islandScale,1,islandScale);cylinder(1.04*islandScale,.025,x,.049,islandZ,M.glow);cylinder(.728*islandScale,.009,x,.375,islandZ,M.ivory);obstacles.push({type:'circle',x,z:islandZ,r:1.06*islandScale});}
// Six concept products. Materials, graphics and geometry are shared by all instances.
const data=SPACE_CONFIG.products;
function labelTexture(index){const p=data[index];return canvasTexture(512,640,(c,w,h)=>{c.fillStyle=p.kind==='pouch'?p.color:(index===1||index===5?'#142318':'#f0efd9');c.fillRect(0,0,w,h);c.fillStyle=p.ink;c.textAlign='left';c.font='500 18px sans-serif';c.fillText('象昇 / 概念展品',30,40);c.fillStyle=p.accent;c.fillRect(30,62,w-60,3);c.font='500 69px "Microsoft YaHei"';c.fillStyle=p.ink;c.textAlign='center';c.fillText(p.name.split(' · ')[0],w/2,153);c.textAlign='left';c.font='26px "Microsoft YaHei"';c.textAlign='center';c.fillText(p.name.split(' · ')[1],w/2,203);c.textAlign='left';c.font='14px sans-serif';c.globalAlpha=.8;c.fillText(p.en,32,235);c.globalAlpha=1;for(let j=0;j<5;j++){c.fillStyle=[p.accent,'#2e5a30','#748b42','#b2bd71','#315e3f'][j];c.beginPath();c.moveTo(0,390+j*33);c.bezierCurveTo(170,265+j*32,310,490+j*10,512,320+j*42);c.lineTo(512,570);c.lineTo(0,570);c.fill();}for(let j=0;j<7;j++){const x=60+j*67,y=385+Math.sin(j*2)*35;c.strokeStyle=index===5?'#e1cb70':'#d6deaf';c.lineWidth=2;c.beginPath();c.moveTo(x,530);c.quadraticCurveTo(x-5,y+40,x+15,y);c.stroke();for(let k=0;k<3;k++){c.fillStyle=index===5?'#ddc16c':'#bdd19b';c.beginPath();c.ellipse(x+10+k*1.6,y+k*22,9,19,.8,0,Math.PI*2);c.fill();}}c.fillStyle=p.ink;c.font='17px sans-serif';c.fillText('DEMO SAMPLE',30,602);c.textAlign='right';c.font='24px sans-serif';c.fillText(p.size,w-30,605);});}
const labelMats=data.map((p,i)=>new T.MeshStandardMaterial({map:labelTexture(i),roughness:.57,metalness:.02}));
const productMaterials=data.map(p=>new T.MeshPhysicalMaterial({color:p.color,roughness:p.kind==='pouch'?.44:.24,metalness:0,clearcoat:p.kind==='bottle'?.3:.12,clearcoatRoughness:.27}));
const capMats=data.map(p=>material(p.cap,.42));
function cap(x,y,r,index,parent){const pts=[[0,-.003],[r*.94,-.003],[r,.002],[r,.041],[r*.94,.047],[0,.047]];const o=lathe(pts,capMats[index],parent);o.position.set(x,y,0);const rib=new T.InstancedMesh(new T.BoxGeometry(.0018,.034,.003),capMats[index],28);const dummy=new T.Object3D();for(let j=0;j<28;j++){const a=j/28*Math.PI*2;dummy.position.set(x+Math.sin(a)*(r+.0005),y+.0205,Math.cos(a)*(r+.0005));dummy.rotation.y=a;dummy.updateMatrix();rib.setMatrixAt(j,dummy.matrix);}parent.add(rib);}
function makeProduct(index){const p=data[index],g=new T.Group();g.userData.product=index;
 if(p.kind==='bottle'){lathe([[0,0],[.046,0],[.050,.004],[.052,.014],[.052,.187],[.050,.205],[.046,.218],[.033,.235],[.024,.242],[.023,.263],[0,.263]],productMaterials[index],g);cap(0,.259,.027,index,g);const geom=new T.CylinderGeometry(.0524,.0524,.154,48,1,true,-1.16,2.32);const label=new T.Mesh(geom,labelMats[index]);label.position.y=.112;g.add(label);cylinder(.024,.008,0,.251,0,capMats[index],g);}
 else if(p.kind==='jug'){box(.19,.233,.115,0,.128,0,productMaterials[index],g,.023,false);const sh=new T.Shape();sh.moveTo(-.092,.22);sh.lineTo(-.092,.315);sh.quadraticCurveTo(-.092,.334,-.073,.334);sh.lineTo(-.011,.334);sh.lineTo(.041,.252);sh.lineTo(.062,.227);sh.closePath();const hole=new T.Path();hole.moveTo(-.062,.247);hole.lineTo(-.062,.301);hole.quadraticCurveTo(-.062,.307,-.055,.307);hole.lineTo(-.025,.307);hole.lineTo(.006,.254);hole.closePath();sh.holes.push(hole);const gh=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.036,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,steps:1}),productMaterials[index]);gh.position.z=-.018;g.add(gh);cylinder(.028,.045,.055,.271,0,productMaterials[index],g);cap(.055,.293,.032,index,g);const l=new T.Mesh(new T.PlaneGeometry(.156,.164),labelMats[index]);l.position.set(0,.135,.0584);g.add(l);box(.177,.01,.104,0,.025,0,productMaterials[index],g,.003,false);}
 else {box(.185,.286,.085,0,.159,0,productMaterials[index],g,.018,false);const face=new T.Mesh(new T.PlaneGeometry(.163,.258),labelMats[index]);face.position.set(0,.161,.043);g.add(face);box(.19,.018,.079,0,.305,0,capMats[index],g,.002,false);box(.186,.012,.088,0,.018,0,capMats[index],g,.003,false);for(let k=0;k<5;k++)box(.177,.0018,.001,0,.300+k*.002,.042,productMaterials[index],g,.0005,false);for(const x of[-.087,.087])box(.002,.255,.001,x,.16,.043,capMats[index],g,.0005,false);}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.product=index;}});return g;}
for(let i=0;i<data.length;i++)templates.push(makeProduct(i));
function placeProduct(index,x,y,z,scale=1,rot=0){const group=templates[index].clone(true);group.position.set(x,y,z);group.rotation.y=rot;group.scale.setScalar(scale);scene.add(group);const id=instances.length;group.userData.instance=id;group.traverse(o=>{if(o.isMesh){o.userData.instance=id;selectable.push(o);}});instances.push(group);return group;}
const arrangements=[[4,0,1,3],[0,2,4,1],[3,0,5,4],[0,4,1,2]];
for(let i=0;i<cabinet.count;i++)for(let row=0;row<cabinet.layers;row++)for(let j=0;j<cabinet.itemsPerShelf;j++){
 const index=arrangements[row][j%4],x=cabLeft+bay*i+.17+j*(bay-.34)/(cabinet.itemsPerShelf-1),y=shelves[row]+.014,z=cabZ+.035;
 const scale=data[index].kind==='jug'?.94:1.02+(j%3)*.03,g=placeProduct(index,x,y,z,scale,(j%2?1:-1)*.035);g.userData.cabinet=i;g.userData.shelf=row;wallProducts.push(g);
}
for(const x of SPACE_CONFIG.exhibition.islands.x){for(let j=0;j<4;j++){const a=Math.PI*.12+j*Math.PI*.25,index=(j+(x>1?2:0))%6;placeProduct(index,x+Math.cos(a)*.79*islandScale,.375,islandZ+Math.sin(a)*.79*islandScale,1.0,Math.cos(a)*.15);}for(let j=0;j<3;j++){const a=j/3*Math.PI*2,index=(j+(x>1?3:0))%6;placeProduct(index,x+Math.sin(a)*.40*islandScale,.598,islandZ+Math.cos(a)*.40*islandScale,1.02,Math.sin(a)*.2);}}
// The floor has subtle contact shadows beneath the island products.
obstacles.push({type:'box',x1:cabLeft-.05,x2:cabLeft+cabWidth+.05,z1:cabZ-cabinet.depth/2,z2:cabZ+cabinet.depth/2});
// Merge static display geometry by material, retaining original meshes as picking proxies.
scene.updateMatrixWorld(true);
const batches=new Map(),tempMatrix=new T.Matrix4();
function addBatch(mesh,matrix,parent=scene){const geo=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();geo.applyMatrix4(matrix);const key=mesh.material.uuid+(parent===ceilings?'ceiling':'')+'/'+mesh.castShadow+'/'+mesh.receiveShadow;if(!batches.has(key))batches.set(key,{material:mesh.material,geometries:[],parent,castShadow:mesh.castShadow,receiveShadow:mesh.receiveShadow});batches.get(key).geometries.push(geo);}
for(const child of [...scene.children]){if(instances.includes(child))continue;child.traverse(mesh=>{if(mesh.isMesh&&!mesh.isInstancedMesh&&!mesh.material.transparent){addBatch(mesh,mesh.matrixWorld,child===ceilings?ceilings:scene);mesh.visible=false;}});}
for(const group of instances){group.traverse(mesh=>{if(!mesh.isMesh)return;if(mesh.isInstancedMesh){const im=new T.Matrix4();for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,im);tempMatrix.multiplyMatrices(mesh.matrixWorld,im);addBatch(mesh,tempMatrix);}}else addBatch(mesh,mesh.matrixWorld);});group.visible=false;}
for(const batch of batches.values()){const merged=mergeGeometries(batch.geometries,false);if(!merged)throw Error('Display geometry batch failed');const mesh=new T.Mesh(merged,batch.material);mesh.castShadow=batch.castShadow;mesh.receiveShadow=batch.receiveShadow;batch.parent.add(mesh);batch.geometries.forEach(g=>g.dispose());}

const offset=SPACE_CONFIG.exhibition.origin;scene.position.set(...offset);scene.name='升级展厅';scene.updateMatrixWorld(true);
return {root:scene,ceilings,interactive:selectable,instances,templates,data,occluders,carpetMat,obstacles:obstacles.map(b=>b.type==='circle'?{...b,x:b.x+offset[0],z:b.z+offset[2]}:{...b,x1:b.x1+offset[0],x2:b.x2+offset[0],z1:b.z1+offset[2],z2:b.z2+offset[2]})};
}
