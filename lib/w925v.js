const axios = require("axios");
const qs = require("qs");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const sputils = require("./sputils");
const EngineerMenu = require("./engineer_menu");

const loginUrl = "/data/Login.json";

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = class W925V {

    constructor(host, password, logger) {
        this.host = host;
        this.password = password;
        this.log = logger;
        this.axiosInstance = axios.create({
            withCredentials: true,
            jar: cookieJar
        });

        this.axiosInstance.interceptors.request.use(request => {
            if (this.log) this.log.debug("Starting Request:\n" + JSON.stringify(request, null, 2));
            return request;
        });

        this.axiosInstance.interceptors.response.use(response => {
            if (this.log) this.log.debug("Response:\n" + JSON.stringify(response.data, null, 2));
            return response;
        });
        this.em = new EngineerMenu(this.axiosInstance, host);
    }

    async login() {
        const httoken = await sputils.getHttoken(this.axiosInstance, this.host);
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

        return this.axiosInstance.post(this.host + loginUrl,
            qs.stringify({
                password: hash,
                showpw: 0,
                httoken: httoken
            }))
            .then(response => response.data)
            .then(data => sputils.checkStatus(data))
            .then(data => sputils.checkLoginStatus(data));
    }

    async getChallenge(httoken) {
        return this.axiosInstance.post(this.host + loginUrl, qs.stringify({"getChallenge": "1", "httoken": httoken}))
            .then(response => {
                sputils.checkStatus(response.data);
                return sputils.findEntry("value", "challenge", response.data);
            });
    }
};

