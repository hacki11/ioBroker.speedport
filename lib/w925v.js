const axios = require("axios").default;
const qs = require("qs");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const sputils = require("./sputils");
const EngineerMenu = require("./engineer_menu");


const loginUrl = "/data/Login.json";

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = class W925V {

    constructor(host, password) {
        this.host = host;
        this.password = password;
        this.config = {
            jar: cookieJar,
            withCredentials: true
        };
        this.em = new EngineerMenu(host, this.config);
    }

    async login() {
        const httoken = await sputils.getHttoken(this.host);
        const challenge = await this.getChallenge(httoken);
        const passwordHash = sputils.hashPassword(challenge, this.password);
        return this.sendLogin(passwordHash, httoken);
    }

    async getAll() {
        return this.em.getAll();
    }

    async logout() {
        return axios.post(this.host + "/data/Login.json", qs.stringify({logout: "byby"}));
    }

    async sendLogin(hash, httoken) {

        return axios.post(this.host + loginUrl,
            qs.stringify({
                password: hash,
                showpw: 0,
                httoken: httoken
            }),
            this.config)
            .then(response => response.data)
            .then(data => sputils.checkStatus(data))
            .then(data => sputils.checkLoginStatus(data));
    }

    async getChallenge(httoken) {
        return axios.post(this.host + loginUrl, qs.stringify({"getChallenge": "1", "httoken": httoken}))
            .then(response => {
                sputils.checkStatus(response.data);
                return sputils.findEntry("value", "challenge", response.data);
            });
    }
};

