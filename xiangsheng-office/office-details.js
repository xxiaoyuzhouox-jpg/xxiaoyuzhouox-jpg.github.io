// Measured additions to the office. Metres; north = -Z, east = +X.
export async function buildOfficeDetails({THREE:T,scene,box,cylinder,textPlane,texCanvas,M,colliders,plant,renderer}){
 const material=(color,roughness=.5,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const timber=material('#66503b',.42),cream=material('#e5ded0',.44),black=material('#202724',.27,.4),sand=material('#b3a17d',.94),stone=material('#79786b',.82),skin=material('#687843',.62),shell=material('#4b5930',.44),scute=material('#88934b',.6);
 const sphere=(rx,ry,rz,x,y,z,mat,parent)=>{const o=new T.Mesh(new T.SphereGeometry(1,20,12),mat);o.scale.set(rx,ry,rz);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
 const plane=(w,h,x,y,z,mat,parent,rotation=0)=>{const o=new T.Mesh(new T.PlaneGeometry(w,h),mat);o.position.set(x,y,z);o.rotation.y=rotation;parent.add(o);return o;};
 // A cabinet aquarium, 2.00 m wide and 1.65 m tall overall.
 const aquarium=new T.Group();aquarium.name='2m落地乌龟缸';aquarium.position.set(18.73,0,10.55);aquarium.rotation.y=-Math.PI/2;scene.add(aquarium);
 box(1.96,.08,.53,0,.04,0,black,aquarium);box(2,.74,.55,0,.45,0,timber,aquarium);
 for(let i=0;i<4;i++){box(.49,.68,.022,-.75+i*.5,.46,.283,cream,aquarium);box(.12,.012,.02,-.75+i*.5,.70,.30,M.brass,aquarium);}
 box(2,.045,.55,0,.8425,0,black,aquarium);box(1.96,.045,.51,0,.885,0,sand,aquarium);
 const glass=new T.MeshPhysicalMaterial({color:'#c6edef',roughness:.08,metalness:.04,transparent:true,opacity:.12,depthWrite:false,side:T.DoubleSide});
 for(const z of[-.266,.266]){const pane=plane(1.99,.77,0,1.25,z,glass,aquarium);pane.castShadow=false;}
 for(const x of[-.994,.994]){const pane=plane(.53,.77,x,1.25,0,glass,aquarium,Math.PI/2);pane.castShadow=false;}
 const water=new T.MeshPhysicalMaterial({color:'#6bacab',roughness:.12,metalness:.07,transparent:true,opacity:.13,depthWrite:false});
 const volume=box(1.96,.45,.50,0,1.125,0,water,aquarium);volume.castShadow=false;
 const surface=plane(1.96,.50,0,1.35,0,new T.MeshPhysicalMaterial({color:'#a9d6ce',transparent:true,opacity:.17,roughness:.09,metalness:.22,depthWrite:false,side:T.DoubleSide}),aquarium);surface.rotation.x=-Math.PI/2;
 box(2,.035,.55,0,1.6325,0,black,aquarium);box(1.90,.012,.024,0,1.61,-.21,M.glow,aquarium);
 for(const x of[-.99,.99])for(const z of[-.265,.265])box(.015,.77,.015,x,1.25,z,black,aquarium);
 for(let i=0;i<32;i++){const x=-.91+(i*37%100)/100*1.82,z=-.19+(i*29%100)/100*.38;sphere(.025+(i%3)*.007,.015,.021,x,.916,z,i%2?stone:sand,aquarium);}
 function turtle(x,y,z,angle){const g=new T.Group();g.name='乌龟';g.position.set(x,y,z);g.rotation.y=angle;aquarium.add(g);
  sphere(.135,.052,.171,0,0,0,skin,g);sphere(.13,.076,.165,0,.043,0,shell,g);
  for(const xx of[-1,1])for(const zz of[-1,1]){const leg=sphere(.05,.023,.075,xx*.128,-.007,zz*.10,skin,g);leg.rotation.y=xx*zz*.48;for(let k=0;k<3;k++)sphere(.005,.004,.016,xx*.15+(k-1)*.011,-.012,zz*.155,cream,g);}
  sphere(.042,.033,.07,0,.01,.185,skin,g);sphere(.054,.04,.058,0,.025,.228,skin,g);
  for(const side of[-1,1]){sphere(.014,.014,.012,side*.043,.045,.246,cream,g);sphere(.007,.008,.006,side*.049,.046,.253,black,g);}
  const tail=sphere(.012,.012,.06,0,-.005,-.19,skin,g);tail.rotation.x=.15;
  for(let row=-1;row<=1;row++)for(let col=-1;col<=1;col++){const tile=sphere(.034,.008,.044,col*.061,.11-Math.abs(col)*.015-Math.abs(row)*.012,row*.081,scute,g);tile.rotation.y=(row+col)*.15;}
  return g;
 }
 turtle(-.52,1.19,.015,.35);turtle(.45,1.14,.02,-.5);
 const tankLight=new T.PointLight(0xdaf5e8,.75,2,2);tankLight.position.set(0,1.53,0);aquarium.add(tankLight);
 colliders.push({x1:18.43,x2:19.04,z1:9.55,z2:11.55});
 // Four adjoining 80 × 120 cm cabinets against the design room's east wall.
 // Depth is provisionally 40 cm; fronts face west into the room.
 const designCabinets=[];
 const cabinetWhite=material('#e4e4db',.40),cabinetDark=material('#303632',.62),paper=material('#eae7da',.9);
 function cabinetHandle(x,y,z,parent,vertical=true){const points=vertical?[[-.003,-.052,0],[0,-.041,.018],[0,.041,.018],[-.003,.052,0]]:[[-.066,0,0],[-.052,0,.018],[.052,0,.018],[.066,0,0]];const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const h=new T.Mesh(new T.TubeGeometry(curve,14,.006,6,false),black);h.position.set(x,y,z);parent.add(h);}
 for(let i=0;i<4;i++){const g=new T.Group();g.name=`设计室柜 ${i+1} · 80×120cm`;g.position.set(8.11,0,.85+i*.8);g.rotation.y=-Math.PI/2;scene.add(g);
  box(.8,.065,.4,0,.0325,0,cabinetDark,g);box(.8,.025,.4,0,1.1875,0,cabinetWhite,g);
  box(.022,1.11,.4,-.389,.62,0,cabinetDark,g);box(.022,1.11,.4,.389,.62,0,cabinetDark,g);box(.756,1.11,.018,0,.62,-.191,cabinetDark,g);
  box(.756,.025,.39,0,.795,0,cabinetDark,g);box(.756,.025,.39,0,.078,0,cabinetDark,g);
  if(i===1){box(.368,.681,.02,-.19,.436,.196,cabinetWhite,g);cabinetHandle(-.065,.49,.208,g);box(.018,.69,.38,0,.44,0,cabinetDark,g);for(let row=0;row<3;row++){const y=.198+row*.233;box(.368,.222,.02,.19,y,.196,cabinetWhite,g);cabinetHandle(.19,y+.015,.208,g,false);}}
  else for(const x of[-.19,.19]){box(.368,.681,.02,x,.436,.196,cabinetWhite,g);cabinetHandle(x+(x<0?.11:-.11),.49,.208,g);const lock=cylinder(.009,.009,.005,x+(x<0?.11:-.11),.66,.210,black,g,12);lock.rotation.x=Math.PI/2;}
  if(i%2===0){for(let j=0;j<4;j++){box(.048,.22+j%2*.04,.20,-.25+j*.063,.92+j%2*.02,-.025,j%2?paper:M.chair,g);box(.026,.11,.003,-.25+j*.063,.94,.078,paper,g);}}
  else {for(let j=0;j<4;j++)box(.25,.009,.18,-.14,.82+j*.012,.015,paper,g);const bottle=cylinder(.035,.035,.16,.19,.884,.015,cream,g,16);cylinder(.029,.029,.025,.19,.976,.015,cabinetDark,g,16);}
  designCabinets.push({x:8.11,z:.85+i*.8,width:.8,height:1.2,depth:.4});
 }
 colliders.push({x1:7.91,x2:8.31,z1:.45,z2:3.65});
 // Glazing is physically closed to walking, with a low wall matching the photo.
 const partition=new T.Group();partition.name='展厅与尹总办公室玻璃隔断';partition.position.set(19.725,0,18.44);scene.add(partition);
 const partitionGlass=new T.MeshPhysicalMaterial({color:'#d5e4e0',roughness:.10,metalness:.07,transparent:true,opacity:.10,depthWrite:false,side:T.DoubleSide});
 plane(5.25,1.63,0,1.365,0,partitionGlass,partition);
 for(const x of[-2.625,2.625])box(.04,1.67,.12,x,1.365,0,M.metal,partition);
 for(const y of[.55,2.18])box(5.29,.035,.12,0,y,0,M.metal,partition);
 for(const x of[-.875,.875])box(.009,1.60,.025,x,1.365,0,M.metal,partition);
 colliders.push({x1:17.1,x2:22.35,z1:18.37,z2:18.51});
 // 1.70 m wide display, preserving the 16:9 screen aspect ratio.
 const tv=new T.Group();tv.name='1.7米宽落地会议电视';tv.position.set(24.35,0,16.28);tv.rotation.y=-Math.PI/2;scene.add(tv);
 const screenW=1.645,screenH=screenW*9/16; // Outer case is exactly 1.70 m wide.
 box(screenW+.055,screenH+.055,.075,0,1.47,0,black,tv);box(.12,1.28,.10,0,.69,-.08,black,tv);
 box(1.12,.055,.55,0,.11,0,black,tv);for(const x of[-.46,.46])for(const z of[-.23,.23])sphere(.055,.055,.035,x,.055,z,black,tv);
 const display=texCanvas(1920,1080,(c,w,h)=>{const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#123f38');bg.addColorStop(1,'#0c2424');c.fillStyle=bg;c.fillRect(0,0,w,h);c.strokeStyle='#76978a40';c.lineWidth=2;for(let i=0;i<8;i++){c.beginPath();c.arc(w*.89,h*.3,140+i*65,0,Math.PI*2);c.stroke();}c.fillStyle='#d6b677';c.fillRect(140,235,70,6);c.fillStyle='#f4f0df';c.font='500 110px "Microsoft YaHei"';c.fillText('象昇',140,405);c.font='400 52px "Microsoft YaHei"';c.fillText('品牌 · 产品 · 共同成长',140,510);c.fillStyle='#a7c1b3';c.font='30px sans-serif';c.fillText('XIANGSHENG  /  MEETING & EXHIBITION',140,610);c.fillStyle='#c4aa74';c.font='26px "Microsoft YaHei"';c.fillText('欢迎来到象昇办公室',140,900);});
 plane(screenW,screenH,0,1.47,.039,new T.MeshBasicMaterial({map:display}),tv);sphere(.006,.006,.004,screenW/2-.04,1.47-screenH/2-.014,.041,M.glow,tv);
 colliders.push({x1:24.0,x2:24.72,z1:15.40,z2:17.16});
 // Yin office: desk is on the west; tea setting and sofas occupy the southeast.
 function sofa(x,z,w,rotation=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rotation;scene.add(g);box(w,.20,.79,0,.30,0,M.chair,g);box(w,.44,.18,0,.62,.34,M.chair,g);for(const xx of[-w/2+.07,w/2-.07]){box(.14,.30,.77,xx,.52,0,M.chair,g);for(const zz of[-.27,.27])cylinder(.025,.025,.18,xx,.09,zz,black,g);}const count=Math.round(w/.7);for(let i=0;i<count;i++)box((w-.3)/count-.012,.11,.60,-(w-.3)/2+(i+.5)*(w-.3)/count,.445,-.035,M.chair,g);return g;}
 sofa(22.35,23.14,2.7);sofa(24.35,21.9,1.8,Math.PI/2);
 colliders.push({x1:20.99,x2:23.71,z1:22.73,z2:23.55},{x1:23.95,x2:24.76,z1:21.0,z2:22.8},{x1:17.63,x2:18.67,z1:19.6,z2:22.0});
 const tea=new T.Group();tea.name='东南角茶海';tea.position.set(22.25,0,21.85);scene.add(tea);box(1.75,.09,.88,0,.66,0,timber,tea);for(const x of[-.67,.67])box(.10,.60,.66,x,.30,0,black,tea);box(1.13,.045,.50,0,.725,0,M.darkOak,tea);for(let i=0;i<10;i++)box(1.02,.003,.006,0,.750,-.20+i*.043,black,tea);
 const ceramic=new T.MeshPhysicalMaterial({color:'#e4dcc7',roughness:.18,clearcoat:.45});sphere(.085,.065,.085,-.22,.815,0,ceramic,tea);cylinder(.055,.055,.014,-.22,.878,0,ceramic,tea);sphere(.012,.014,.012,-.22,.892,0,ceramic,tea);const spout=cylinder(.022,.011,.10,-.12,.84,0,ceramic,tea);spout.rotation.z=-.9;const handle=new T.Mesh(new T.TorusGeometry(.061,.010,10,32),ceramic);handle.position.set(-.30,.83,0);tea.add(handle);
 for(const x of[.03,.19,.35]){cylinder(.031,.022,.044,x,.782,.06,ceramic,tea);cylinder(.026,.026,.003,x,.805,.06,timber,tea);cylinder(.045,.045,.006,x,.755,.06,ceramic,tea);}
 colliders.push({x1:21.375,x2:23.125,z1:21.41,z2:22.29});plant(24.35,23.2,.8);
 // Partner wall: source logos from the supplied reference, arranged on actual relief tiles.
 const brand=new T.Group();brand.name='象昇品牌墙 4.2×1.8m';brand.position.set(11.05,0,11.82);brand.rotation.y=Math.PI;scene.add(brand);
 box(5,2.5,.035,0,1.25,0,material('#aaa08d',.75),brand);box(4.22,1.82,.025,0,1.35,.03,black,brand);
 const atlas=await new T.TextureLoader().loadAsync('./assets/brand-wall.jpg');atlas.colorSpace=T.SRGBColorSpace;atlas.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const logoMaterial=new T.MeshStandardMaterial({map:atlas,roughness:.53});
 for(let row=0;row<6;row++)for(let col=0;col<14;col++){if((row===2||row===3)&&(col===6||col===7))continue;const x=-2.1+(col+.5)*.3,y=2.25-(row+.5)*.3,depth=.045+((col*7+row*3)%4)*.007;box(.296,.296,depth,x,y,.05+depth/2,cream,brand);const face=plane(.292,.292,x,y,.052+depth,logoMaterial,brand),uv=face.geometry.attributes.uv;for(let i=0;i<uv.count;i++){const u=uv.getX(i),v=uv.getY(i);uv.setXY(i,(col+.02+u*.96)/14,1-(row+.98-v*.96)/6);}uv.needsUpdate=true;}
 box(.596,.596,.085,0,1.35,.105,material('#df0017',.4),brand);textPlane('象昇\n品牌',.57,.57,0,1.35,.149,{bg:'#df0017',color:'#fff8ed',size:270,parent:brand});
 box(4.45,.022,.04,0,2.43,.23,black,brand);for(const x of[-1.7,-.55,.55,1.7]){const lamp=cylinder(.026,.026,.12,x,2.35,.23,cream,brand);lamp.rotation.x=.4;const light=new T.PointLight(0xffecd0,.25,2.5,2);light.position.set(x,2.28,.35);brand.add(light);}
 // A shallow stone bed keeps the public corridor clear.
 box(4.6,.055,.20,0,.028,.17,black,brand);for(let i=0;i<42;i++)sphere(.045+(i%4)*.009,.035,.052,-2.2+i*.107,.072,.17+(i%2-.5)*.07,i%3?stone:sand,brand);
 plant(8.85,11.43,.52);plant(13.24,11.43,.52);
 return {designCabinets,aquarium:{x:18.73,z:10.55,width:2,height:1.65,depth:.55,turtles:2},glass:{x:19.725,z:18.44,width:5.25,sill:.55,top:2.18},tv:{inches:Math.hypot(screenW,screenH)/.0254,width:screenW,height:screenH,x:24.35,z:16.28},yin:{desk:{x:18.15,z:20.8,side:'west'},tea:{x:22.25,z:21.85},sofas:2},brand:{x:11.05,z:11.82,wallWidth:5,wallHeight:2.5,width:4.2,height:1.8,tile:.3,columns:14,rows:6,bottom:.45,topGap:.25}};
}
