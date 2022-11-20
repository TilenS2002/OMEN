
import { rotationY, translation, transform as transformacija, rotationZ, scaling, rotationX } from './Matrix.mjs';
export function transform(points) {
    
    let resitev=new Array;

    for(let i=0;i<points.length; i++){
        let premiki=0;
        premiki=(transformacija(translation([2.8, 0, 0]),points[i])); // premik vzdolž osi X za 2.8
        premiki=(transformacija(rotationY(Math.PI/4),premiki));// vrtenje okrog osi Y za kot pi/4
        premiki=(transformacija(translation([0, 0, 7.15]),premiki));// premik vzdolž osi Z za 7.15
        premiki=(transformacija(translation([0, 2.45, 0]),premiki));// premik vzdolž osi Y za 2.45
        premiki=(transformacija(scaling([1.8, 1.8, 1]),premiki));// razteg vzdolž osi X in Y za faktor 1.8
        premiki=(transformacija(rotationX(5*Math.PI/11),premiki));// vrtenje okrog osi X za kot 5*pi/11
        premiki=(transformacija(rotationZ(9*Math.PI/11),premiki));// vrtenje okrog osi Z za kot 9*pi/11
        resitev.push(premiki);
    }
    let res_resitev=[...resitev];
    for(let i=0;i<resitev.length; i++){
        res_resitev[i].pop();
    }

    return resitev;
}

// let points= [[1,2,3],[2,3,4],[3,4,5],[4,5,6]];
// console.log(transform(points));



