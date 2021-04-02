const axios = require("axios").default;
const qs = require("qs");
const sjcl = require("sjcl");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const sputils = require("./sputils");

const loginUrl = "/data/Login.json";

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
module.exports = class Smart3 {

    constructor(host, password, logger) {
        this.host = host;
        this.password = password;
        //this.log = Object.is(logger, undefined) ? ;
        this.config = {
            jar: cookieJar,
            withCredentials: true
        };
        this.challenge = "";
        this.axiosEncryption = {
            jar: cookieJar,
            withCredentials: true,
            transformResponse: (res) => this.transformResponse(res),
            transformRequest: (data) => this.transformRequest(data)
        };
        // Called multiple times
        // axios.interceptors.request.use(request => {
        //     console.log("Starting Request", JSON.stringify(request, null, 2));
        //     return request;
        // });
        //
        // axios.interceptors.response.use(response => {
        //     console.log("Response:", JSON.stringify(response.data, null, 2));
        //     return response;
        // });
    }

    async login() {
        const httoken = await sputils.getHttoken(this.host);
        this.challenge = await this.getChallenge(httoken);
        const hash = sputils.hashPassword(this.challenge, this.password);
        return this.sendLogin(hash, httoken, this.challenge);
    }

    async getAll() {
        //TODO
        return [];
    }

    transformResponse(response) {
        console.log("Response: " + JSON.stringify(response));
        const json = this.decryptJSON(response, this.challenge);
        console.log("Response dec: " + JSON.stringify(json));
        return json;
    }

    transformRequest(data) {
        console.log("Request: " + data);
        return this.encrypt(data, this.challenge);
    }

    async getChallenge(httoken) {
        return axios.post(this.host + loginUrl, qs.stringify({getChallenge: 1, httoken: httoken}), this.axiosEncryption)
            .then(response => sputils.checkStatus(response.data))
            .then(data => sputils.findEntry("value", "challenge", data));
    }

    async sendLogin(hash, httoken) {

        return axios.post(this.host + loginUrl,
            qs.stringify({
                password: hash,
                showpw: 0,
                httoken: httoken
            }),
            this.axiosEncryption)
            .then(response => sputils.checkStatus(response.data))
            .then(data => sputils.checkLoginStatus(data));
    }


    parameterize(json) {

        // parameterize json
        const query = new URLSearchParams(json).toString();
        return query;
    }

    encrypt(data, key) {
        // this.log.debug("Request: " + data);
        const keyArrayDefault = "cdc0cac1280b516e674f0057e4929bca84447cca8425007e33a88a5cf598a190";
        let keyArray, iv;

        if (key === "" || key == null) {
            keyArray = sjcl.codec.hex.toBits(keyArrayDefault);
            iv = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(keyArrayDefault.substr(0, 16)));
        } else {
            keyArray = sjcl.codec.hex.toBits(key);
            iv = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(key.substr(0, 16)));
        }

        const encryptJSON = sjcl.encrypt(keyArray, data, {"iv": iv, "ks": 256, "ts": 128});
        const ct = JSON.parse(encryptJSON).ct;
        const encrypted = sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(ct));
        //this.log.debug("Request encrypted: " + encrypted);
        return encrypted;
    }

    decryptJSON(data, key) {
        const result = this.decrypt(data, key);
        try {
            return JSON.parse(result);
        } catch (e) {
            return result;
        }
    }

    decrypt(data, key) {
        let decryptText;
        let isJSON = true, tryDefault = false;

        try {
            decryptText = JSON.parse(data);
            //  this.log.debug("Response: " + decryptText);
        } catch (e) {
            isJSON = false;
        }

        if (isJSON === true) {
            return decryptText;
        }

        const keyArrayDefault = "cdc0cac1280b516e674f0057e4929bca84447cca8425007e33a88a5cf598a190";
        let keyArray;
        const cipherText = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(data));

        let iv;

        if (key !== "" && key != null) {

            keyArray = sjcl.codec.hex.toBits(key);
            iv = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(key.substr(0, 16)));
            try {
                decryptText = sjcl.decrypt(keyArray, "{\"iv\":\"" + iv + "\",\"v\":1,\"iter\":1000,\"ks\":256,\"ts\":128,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"\",\"ct\":\"" + cipherText + "\"}");
            } catch (e) {
                decryptText = "[]";
                tryDefault = true;
            }
        } else {
            tryDefault = true;
        }


        if (tryDefault === true) {
            keyArray = sjcl.codec.hex.toBits(keyArrayDefault);
            iv = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(keyArrayDefault.substr(0, 16)));
            try {
                decryptText = sjcl.decrypt(keyArray, "{\"iv\":\"" + iv + "\",\"v\":1,\"iter\":1000,\"ks\":256,\"ts\":128,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"\",\"ct\":\"" + cipherText + "\"}");
            } catch (e) {
                decryptText = "[]";
            }
        }
        //this.log.debug("Response decrypted: " + decryptText);
        return decryptText;
    }
};