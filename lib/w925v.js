const axios = require("axios").default;
const qs = require("qs");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const sputils = require("./sputils");
const {DslConfig} = require("./w925v_config");
const {InterfaceLanConfig} = require("./w925v_config");
const {InterfaceWanConfig} = require("./w925v_config");
const {MemCpuUtilizationConfig} = require("./w925v_config");

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

    async getAll() {
        return [].concat
            .apply([], await Promise.all([
                this.getDsl(),
                this.getInterfaceLan(),
                this.getInterfaceWan(),
                this.getMemCpuUtilization()
            ]));
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
        const httoken = await sputils.getHttoken(this.host);
        const challenge = await this.getChallenge(httoken);
        const passwordHash = sputils.hashPassword(challenge, this.password);
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

