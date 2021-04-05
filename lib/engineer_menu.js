const {DslConfig} = require("./engineer_menu_objects");
const {InterfaceLanConfig} = require("./engineer_menu_objects");
const {InterfaceWanConfig} = require("./engineer_menu_objects");
const {MemCpuUtilizationConfig} = require("./engineer_menu_objects");
const {ModuleVersionsConfig} = require("./engineer_menu_objects");

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

module.exports = class EngineerMenu {

    constructor(axios, host) {
        this.host = host;
        this.axios = axios;
    }

    async getAll() {
        return [].concat
            .apply([], await Promise.all([
                this.getDsl(),
                this.getInterfaceLan(),
                this.getInterfaceWan(),
                this.getMemCpuUtilization(),
                this.getModuleVersions()
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

    async getModuleVersions() {
        return await this.get("/engineer/html/module_versions.stm")
            .then(response => this.parse(ModuleVersionsConfig, response.data));
    }

    async get(url) {
        return this.axios.get(this.host + url);
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
};