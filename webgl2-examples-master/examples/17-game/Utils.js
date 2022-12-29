export class Utils {

    static init(object, defaults, options) {
        const filtered = Utils.clone(options ?? {});
        console.log(filtered);
        const defaulted = Utils.clone(defaults ?? {});
        console.log(defaulted);
        for (const key in filtered) {
            if (!defaulted.hasOwnProperty(key)) {
                delete filtered[key];
            }
        }
        Object.assign(object, defaulted, filtered);
        console.log(options);
    }

    static clone(object) {
        return JSON.parse(JSON.stringify(object));
    }

}
