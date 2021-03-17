const axios = require("axios").default;
const qs = require("qs");
const sjcl = require("sjcl");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const {DslConfig} = require("./w925v_config");
const {InterfaceLanConfig} = require("./w925v_config");
const {InterfaceWanConfig} = require("./w925v_config");
const {MemCpuUtilizationConfig} = require("./w925v_config");

const httokenRegex = /_httoken = (\d*);/;
const loginUrl = "/data/Login.json";

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

/*
Available hidden menus
engineer/html/dhcpd_hidden.stm
engineer/html/dhcpc_hidden.stm
engineer/html/pppoe_hidden.stm
engineer/html/ipv6_hidden.stm
engineer/html/setup_dns.stm
engineer/html/dns_qos_hidden.stm
engineer/html/dns_cache_hidden.stm
engineer/html/arp_hidden.stm
engineer/html/igmp_hidden.stm
engineer/html/igmp_snooping_hidden.stm
engineer/html/wireless_id.stm
engineer/html/wireless_e.stm
engineer/html/wireless_client_hidden.stm
engineer/html/route_tbl.stm
engineer/html/r_mort.stm
engineer/html/dsl_hidden_status.stm
engineer/html/firewall_spi_h.stm
engineer/html/speed_dial.stm
engineer/html/interfaces_hidden_lan.stm
engineer/html/interfaces_hidden_wan.stm
engineer/html/dtag_privacy.stm
engineer/html/mem_cpu_utilization.stm
engineer/html/email_abuse_util.stm
engineer/html/first_call_init.stm
engineer/html/module_versions.stm
engineer/html/qos_hidden.stm
engineer/html/erp_mode.stm
engineer/html/mcjp.stm
engineer/html/backup_restore.stm
engineer/html/sip_listener.stm
voip_ippbx.stm
voip_ippbx_number.stm
voip_intern.stm
 */

module.exports = class W925V {

    constructor(host, password) {
        this.host = host;
        this.password = password;
        this.config = {
            jar: cookieJar,
            withCredentials: true
        };
    }

    async get(url) {
        return axios.get(this.host + url, {jar: cookieJar, withCredentials: true});
    }

    async getDsl() {
        return this.get("/engineer/html/dsl_hidden_status.stm")
            .then(response => this.parse(DslConfig, response.data));
    }

    async getInterfaceLan() {
        return this.get("/engineer/html/interfaces_hidden_lan.stm")
            .then(response => this.parse(InterfaceLanConfig, response.data));
    }

    async getInterfaceWan() {
        return this.get("/engineer/html/interfaces_hidden_wan.stm")
            .then(response => this.parse(InterfaceWanConfig, response.data));
    }

    async getMemCpuUtilization() {
        return await this.get("/engineer/html/mem_cpu_utilization.stm")
            .then(response => this.parse(MemCpuUtilizationConfig, response.data));
    }

    parse(configObjects, text) {
        for (const config of configObjects) {
            const match = text.match(config.regex);
            if (match) {
                config.value = match[1];
            }
        }
        return configObjects;
    }

    async login() {
        const httoken = await this.getHttoken();
        const challenge = await this.getChallenge(httoken);
        const passwordHash = this.hashPassword(challenge);
        return this.sendLogin(passwordHash, httoken);
    }

    async sendLogin(hash, httoken) {

        return axios.post(this.host + loginUrl,
            qs.stringify({
                password: hash,
                showpw: 0,
                httoken: httoken
            }),
            {
                jar: cookieJar,
                withCredentials: true
            })
            .then(response => response.data)
            .then(data => this.checkStatus(data))
            .then(data => this.checkLoginStatus(data));
    }

    hashPassword(challenge) {
        const encryptpwd = sjcl.hash.sha256.hash(challenge + ":" + this.password);
        const passwordhash = sjcl.codec.hex.fromBits(encryptpwd, true);
        return passwordhash;
    }

    async getChallenge(httoken) {
        return axios.post(this.host + loginUrl, qs.stringify({"getChallenge": "1", "httoken": httoken}))
            .then(response => {
                this.checkStatus(response.data);
                return this.findEntry("value", "challenge", response.data);
            });
    }

    checkLoginStatus(json) {
        const status = this.findEntry("status", "login", json);
        if (status !== "success") {
            throw new Error("Login status not ok: " + status);
        }
        return json;
    }

    checkStatus(json) {
        const status = this.findEntry("status", "status", json);
        if (status !== "ok") {
            throw new Error("Status not ok: " + status);
        }
        return json;
    }

    findEntry(vartype, varid, json) {
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
        throw new Error("Could not find vartype " + vartype + " and " + varid);
    }

    async getHttoken() {

        return axios.get(this.host)
            .then(response => httokenRegex.exec(response.data))
            .then(match => {
                if (match !== null)
                    return match[1];
                else
                    throw new Error("Could not find _httoken in response");
            });
    }
};

