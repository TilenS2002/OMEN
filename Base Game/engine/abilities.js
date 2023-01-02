export class abilities {
    constructor() {}
    water(obj, bool) {
        // this.setBool();
        // console.log(bool);
        obj.setPremik(bool);
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