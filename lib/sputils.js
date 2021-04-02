const axios = require("axios").default;
const sjcl = require("sjcl");


function findEntry(vartype, varid, json) {
    for (const element in Object.keys(json)) {
        if (Object.prototype.hasOwnProperty.call(json[element], "vartype")) {
            if (json[element]["vartype"] === vartype) {
                if (Object.prototype.hasOwnProperty.call(json[element], "varid")) {
                    if (json[element]["varid"] === varid) {
                        // this is the right array entry
                        return json[element]["varvalue"];
                    }
                }
            }
        }
    }
    throw new Error("Could not find vartype " + vartype + " and " + varid + " in " + json);
}

function checkStatus(json) {
    const status = this.findEntry("status", "status", json);
    if (status !== "ok") {
        throw new Error("Status not ok: " + status);
    }
    return json;
}

const httokenRegex = /_httoken = (\d*);/;

async function getHttoken(host) {

    return axios.get(host)
        .then(response => httokenRegex.exec(response.data))
        .then(match => {
            if (match !== null)
                return match[1];
            else
                throw new Error("Could not find _httoken in response");
        });
}

function hashPassword(challenge, password) {
    const encryptpwd = sjcl.hash.sha256.hash(challenge + ":" + password);
    return sjcl.codec.hex.fromBits(encryptpwd, true);
}

function checkLoginStatus(json) {
    const status = findEntry("status", "login", json);
    if (status !== "success") {
        throw new Error("Login status not ok: " + status);
    }
    return json;
}

module.exports = {
    findEntry,
    checkStatus,
    getHttoken,
    hashPassword,
    checkLoginStatus
};