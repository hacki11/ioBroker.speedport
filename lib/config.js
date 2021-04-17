class ConfigObject {
    constructor(id, name, dynamic, dataType, unit, role, parser) {
        this.id = id;
        this.name = name;
        this.dynamic = dynamic
        this.parser = parser;
        this.value = null;
        this.obj = {
            type: "state",
            common: {
                name: name,
                type: dataType,
                role: role,
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