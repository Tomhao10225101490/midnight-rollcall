import * as T from 'three';
/** Conservative body bounds for solid interactive furniture, independent of tiny trim. */
export function stationBounds(index:number,x:number,z:number){
 const [w,h,d]=[[1.5,.86,.95],[1.05,1.84,.6],[1.6,1.8,.9],[1.2,1.8,.35],[.5,1.56,.4]][index]??[1.5,.86,.95];
 return new T.Box3(new T.Vector3(x-w/2,0,z-d/2),new T.Vector3(x+w/2,h,z+d/2));
}
