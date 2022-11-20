// Return vectors as arrays, e.g.:
// return [ 1, 2, 3, 4 ];

export function negate(v) {
    let neg_v = [...v];
    for (let i = 0; i< neg_v.length; i++){
        neg_v[i]= neg_v[i] * (-1);
    }
    return neg_v;
}

export function add(v, w) {
    if(v.length===w.length){///3= prever se ce je isti tip + enaka
        let vrednost= [];
        for(let i=0; i< v.length; i++){
            vrednost.push(v[i]+w[i]);
        }
        return vrednost;
    }
}

export function subtract(v, w) {
    if(v.length===w.length){///3= prever se ce je isti tip + enaka
        let vrednost= [];
        for(let i=0; i< v.length; i++){
            vrednost.push(v[i]-w[i]);
        }
        return vrednost;
    }
}

export function multiply(v, w) {
    if(v.length===w.length){///3= prever se ce je isti tip + enaka
        let vrednost= [];
        for(let i=0; i< v.length; i++){
            vrednost.push(v[i]*w[i]);
        }
        return vrednost;
    }
}

export function divide(v, w) {
    if(v.length===w.length){///3= prever se ce je isti tip + enaka
        let vrednost= [];
        for(let i=0; i< v.length; i++){
            vrednost.push(v[i]/w[i]);
        }
        return vrednost;
    }
}

export function dot(v, w) {
    if(v.length===w.length){///3= prever se ce je isti tip + enaka
        let vrednost= 0;
        for(let i=0; i< v.length; i++){
            vrednost+=(v[i]*w[i]);
        }
        return vrednost;
    }
}

export function cross(v, w) {
    if(v.length===w.length){///3= prever se ce je isti tip + enaka
        let vrednost= [];
        vrednost.push((v[1]*w[2])-(w[1]*v[2]));
        vrednost.push((v[2]*w[0])-(w[2]*v[0]));
        vrednost.push((v[0]*w[1])-(w[0]*v[1]));
        return vrednost;
    }
}

export function length(v) {
    let dolzina= 0;
    for(let i=0;i<v.length;i++){
        dolzina+=(v[i]**2);
    }
    return Math.sqrt(dolzina);
}

export function normalize(v) {
    let normal= []
    for(let i=0;i<v.length;i++){
       normal.push(v[i]/length(v)); 
    }
    return normal;
}

export function project(v, w) {
    if(v.length===w.length){
        let proj=[];
        let ulomek= (dot(v,w))/((length(w))**2);
        for(let i=0;i<v.length;i++){
            proj.push(w[i]*ulomek);
        }
    return proj;
    }
}

export function reflect(v, w) {
    let normaliziran= normalize(w);
    let oklepaj=[];
    for(let i=0;i<w.length; i++){
        oklepaj.push(2*(dot(v,normaliziran)));
    }
    let zmnozek= multiply(oklepaj,normaliziran);
    if(v.length===w.length){
        return (subtract(v,zmnozek));
    }

}

export function angle(v, w) {
     let zmnozek= dot(v,w);
     let kot=Math.acos(zmnozek/((length(v))*(length(w))));
     return kot;
}

// var v= [1, 2, 3]
// var w= [4, 5, 6]
// console.log("negacija: ", negate(v))//prov

// console.log("seštevanje: ", add(v,w))//prov
// console.log("odštevanje: ", subtract(v,w))//prov
// console.log("množenje: ", multiply(v, w))//prov
// console.log("deljenje: ", divide(v, w))//prov
// console.log("dot:", dot(v, w))//prov
// console.log("cross: ", cross(v, w))
// console.log("dolžina: ", length(v))//prov
// console.log("normalizacija: ", normalize(v)) //prov
// console.log("proj: ", project(v, w))//prov
// console.log("reflekcija: ", reflect(v, w))
// console.log("kot: ", angle(v, w))//prov
