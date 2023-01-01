export class abilities {
    constructor() {
        this.bool = false
        this.setBool = function () {
            this.bool = !this.bool;
        }
    }
    water(obj, bool) {
        // this.setBool();
        console.log(bool);
        obj.setPremik(bool);
        return "water";
    }
    earth(obj, bool) {
        obj.setPremik(bool);
        return "earth";
    }
    fire(obj, bool) {
        obj.setPremik(bool);
        return "fire";
    }
    stone(obj, bool) {
        obj.setPremik(bool);
        return "stone";
    }
}