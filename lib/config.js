class ConfigObject {
    constructor(id, name, dataType, unit, regex) {
        this.id = id;
        this.name = name;
        this.regex = regex;
        this.value = null;
        this.obj = {
            type: "state",
            common: {
                name: name,
                type: dataType,
                role: "value",
                read: true,
                write: false,
                unit: unit
            }
        };
    }
}

module.exports = {
    ConfigObject
};