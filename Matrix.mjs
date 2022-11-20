// Return matrices as 2D arrays in row-major order, e.g.:
// return [
//     [ 1, 2, 3, 4 ],
//     [ 5, 6, 7, 8 ],
//     [ 7, 6, 5, 4 ],
//     [ 3, 2, 1, 0 ],
// ];

export function identity() {
    let identiteta= [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    return identiteta;
}

export function translation(t) {
    let translated= [
        [1, 0, 0, t[0]],
        [0, 1, 0, t[1]],
        [0, 0, 1, t[2]],
        [0, 0, 0, 1]
    ];
    return translated;
}

export function scaling(s) {
    let scale= [
        [s[0], 0, 0, 0],
        [0, s[1], 0, 0],
        [0, 0, s[2], 0],
        [0, 0, 0, 1]
    ];
    return scale;
}

export function rotationX(angle) {
    let rotacija_X= [
        [1, 0, 0, 0],
        [0, Math.cos(angle), -(Math.sin(angle)), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 0, 1]
    ];
    return rotacija_X;
}

export function rotationY(angle) {
    let rotacija_Y= [
        [Math.cos(angle), 0, Math.sin(angle), 0],
        [0, 1, 0, 0],
        [-(Math.sin(angle)), 0, Math.cos(angle), 0],
        [0, 0, 0, 1]
    ];
    return rotacija_Y;
}

export function rotationZ(angle) {
    let rotacija_Z= [
        [Math.cos(angle), -(Math.sin(angle)), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    return rotacija_Z;
}

export function negate(m) {
    let okoli= [];
    for(let i=0;i<m.length;i++){
        let po_en= [];
        for(let j=0;j<m[0].length;j++){
            po_en.push(m[i][j]*(-1)); 
        }
        okoli.push(po_en);
    }
    return okoli;
}

export function add(m, n) {
    let sestevek= [];
    if(m.length === n.length && m[0].length===n[0].length){
        for(let i=0;i<m.length;i++){
            let po_en= [];
            for(let j=0;j<m[0].length;j++){
                po_en.push(m[i][j]+n[i][j]); 
            }
            sestevek.push(po_en);
        }
        return sestevek;
    }
    
}

export function subtract(m,n) {
    let odstevek= [];
    if(m.length === n.length && m[0].length===n[0].length ){
        for(let i=0;i<m.length;i++){
            let po_en= [];
            for(let j=0;j<m[0].length;j++){
                po_en.push(m[i][j]-n[i][j]); 
            }
            odstevek.push(po_en);
        }
        return odstevek;
    }
    
}

export function transpose(m) {
    let transpozirana = [];
    for(let i=0;i< m[0].length ; i++){
        transpozirana.push([]);
    }
    for(let i=0;i< m[0].length ; i++){
        for (let j=0; j< m.length; j++){
            transpozirana[i].push(m[j][i]);
        }
    }
    return transpozirana;
}

export function multiply(m, n) {
    const dimenzije_m= [m.length, m[0].length];//[0]-vrstice, [1]-stolpci
    const dimenzije_n= [n.length, n[0].length];
    if(dimenzije_m[1] == dimenzije_n[0]){
        let produkt_vrstice= new Array(dimenzije_m[0]);
    
        for(let i=0; i<dimenzije_m[0]; i++){
            produkt_vrstice[i]=new Array(dimenzije_n[1]);
            for(let j=0; j<dimenzije_n[1]; j++){
                produkt_vrstice[i][j]=0;
                for(let k=0; k<dimenzije_m[1]; k++){
                    produkt_vrstice[i][j]+= (m[i][k]) * (n[k][j]); 
                }
            }
        }
        return produkt_vrstice;
    }
    
}

export function transform(m, v) {
    let novi_v= [];
    for(let i=0; i< v.length;i++){
        novi_v[i]=([v[i]]);
    }
    if(v.length==3){
        novi_v.push([1]);
    }

    const dimenzije_m= [m.length, m[0].length];//[0]-vrstice, [1]-stolpci
    const dimenzije_v= [novi_v.length, novi_v[0].length];
    if(dimenzije_m[1] == dimenzije_v[0]){
        let zmnožek=multiply(m, novi_v);
        let transformacija= [];
        for(let i=0; i<zmnožek.length;i++){
            transformacija.push(zmnožek[i][0]);
        }
    return transformacija;
    }
}


// let m= [
//     [1, 2, 1, 2, 10, 10, 7, 100, 32],
//     [3, 4, 1, 1, 11, 65, 77, 43, 3],
//     [1, 2, 1, 2, 67, 77, 85, 14, 75],
//     [3, 4, 1, 1, 85, 2, 11, 24, 41]
// ]

// let n= [
//     [5, 2, 4, 1],
//     [3, 4, 1, 7],
//     [2, 3, 1, 2],
//     [1, 9, 6, 8],
//     [2, 55, 43, 27],
//     [23, 44, 12, 55],
//     [24, 74, 2, 0],
//     [13, 2, 5, 90],
//     [110, 1, 0, 56]
// ]

// let angle = 30;
// let t= [1, 2, 3];
// let s= [1, 2, 3];
// let v= [2,2,2]
// // let m = [[2,1,4], 
// //          [0,1,1], 
// //         ],
// //     n = [[6, 3, -1, 0], 
// //          [1, 1, 0, 4],
// //          [-2, 5, 0, 2]
// //         ];

// console.log("identiteta: ", identity())//delaa
// console.log("premik: ", translation(t))
// console.log("razteg: ", scaling(s))
// console.log("rotacija X: ", rotationX(angle))
// console.log("rotacija Y: ", rotationY(angle))
// console.log("rotacija Z: ", rotationZ(angle))
// console.log("negacija", negate(m))
// console.log("seštevanje: ", add(m, n))//delaaa
// console.log("odštevanje: ", subtract(m,n))//dela
// console.log("transponiranje: ", transpose(m))//delaa
// console.log("množenje: ", multiply(m, n))//dela
// console.log("transformacija: ", transform(m, v))
