// Decorative textures must never prevent navigation from starting.
export function loadOptionalTexture(loader,url,timeout=7000){
 return new Promise(resolve=>{let settled=false;const finish=value=>{if(settled){value?.dispose();return;}settled=true;clearTimeout(timer);resolve(value);};const timer=setTimeout(()=>finish(null),timeout);
  try{loader.load(url,t=>finish(t),undefined,()=>finish(null));}catch{finish(null);}
 });
}
