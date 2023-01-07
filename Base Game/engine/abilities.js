export class abilities {
    constructor() {}
    water(obj, bool) {
        obj.setPremik(bool);
        console.log("voda");
        return "water";
    }
    nature(obj, bool) {
        obj.setPremik(bool);
        return "nature";
    }
    fire(obj, bool) {
        obj.setPremik(bool);
        return "fire";
    }
    earth(obj, bool) {
        obj.setPremik(bool);
        return "earth";
    }
}