const axios = require("axios");
const qs = require("qs");
const sjcl = require("sjcl");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const sputils = require("./sputils");
const EngineerMenu = require("./engineer_menu");

const loginUrl = "/data/Login.json";

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
module.exports = class Smart3 {

    constructor(host, password, logger) {
        this.host = host;
        this.password = password;
        this.log = logger;
        this.challenge = "";
        this.axiosInstance = axios.create({
            jar: cookieJar,
            withCredentials: true,
            transformRequest: (req) => this.encrypt(req, this.challenge),
            transformResponse: (res) => this.decryptJSON(res, this.challenge)
        });

        // Called multiple times
        this.axiosInstance.interceptors.request.use(request => {
            if (this.log) this.log.debug("Starting Request:\n" + JSON.stringify(request, null, 2));
            return request;
        });

        this.axiosInstance.interceptors.response.use(response => {
            if (this.log) this.log.debug("Response:\n" + JSON.stringify(response.data, null, 2));
            return response;
        });
        this.em = new EngineerMenu(host, this.config);
    }

    async login() {
        const httoken = await sputils.getHttoken(this.axiosInstance, this.host);
        this.challenge = await this.getChallenge(httoken);
        const hash = sputils.hashPassword(this.challenge, this.password);
        return this.sendLogin(hash, httoken, this.challenge);
    }

    async getAll() {
        return this.em.getAll();
    }

    async getChallenge(httoken) {
        return this.axiosInstance.post(this.host + loginUrl, qs.stringify({
            getChallenge: 1,
            httoken: httoken
        }), this.config)
            .then(response => sputils.checkStatus(response.data))
            .then(data => sputils.findEntry("value", "challenge", data));
    }

    async sendLogin(hash, httoken) {
        return this.axiosInstance.post(this.host + loginUrl,
            qs.stringify({
                password: hash,
                showpw: 0,
                httoken: httoken
            }),
            this.config)
            .then(response => sputils.checkStatus(response.data))
            .then(data => sputils.checkLoginStatus(data));
    }

    async logout() {
        return this.axiosInstance.post(this.host + "/data/Login.json", qs.stringify({logout: "byby"}))
            .then(() => this.challenge = "");
    }

    parameterize(json) {
        // parameterize json
        return new URLSearchParams(json).toString();
    }

    encrypt(data, key) {
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
        return decryptText;
    }
};