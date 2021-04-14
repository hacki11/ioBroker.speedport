const {ConfigObject} = require("./config");
const sp = require("./sputils");

function initINetIP() {
    const objects = [];

    // commented objects are fetched over engineering menu because there are more infos.

    // state(objects, "WAN.ipv4_address", "WAN IPv4 Address", "string", "", "info.ip", d => parse("value", "public_ip_v4", d));
    // value(objects, "WAN.ipv4_gateway", "WAN IPv4 Gateway", "string", "", d => parse("value", "gateway_ip_v4", d));
    value(objects, "WAN.ipv4_dns_primary", "WAN IPv4 Primary DNS Server", "string", "", d => parse("value", "dns_v4", d));
    value(objects, "WAN.ipv4_dns_secondary", "WAN IPv4 Secondary DNS Server", "string", "", d => parse("value", "sec_dns_v4", d));
    // value(objects, "WAN.ipv6_address", "WAN IPv6 Address", "string", "", d => parse("value", "public_ip_v6", d));
    // value(objects, "WAN.ipv6_gateway", "WAN IPv6 Gateway", "string", "", d => parse("value", "gateway_ip_v6", d));
    value(objects, "WAN.ipv6_dns_primary", "WAN IPv6 Primary DNS Server", "string", "", d => parse("value", "dns_v6", d));
    value(objects, "WAN.ipv6_dns_secondary", "WAN IPv6 Secondary DNS Server", "string", "", d => parse("value", "sec_dns_v6", d));
    // value(objects, "WAN.ipv6_lan_pool", "WAN IPv6 LAN Pool", "string", "", d => parse("value", "transmitted_ip_v6_pool_for_lan", d));
    // value(objects, "WAN.ipv6_lan_address", "WAN IPv6 LAN Address", "string", "", d => parse("value", "used_ip_v6_lan", d));
    // value(objects, "WAN.status", "WAN Status", "string", "", d => parse("status", "onlinestatus", d));
    value(objects, "WAN.uptime", "WAN Connection Uptime", "number", "s", d => parseWanUptime(d));
    value(objects, "DSL.link_status", "DSL Link Status", "string", "", d => parse("value", "dsl_link_status", d));
    value(objects, "DSL.dualstack", "DSL Dualstack", "number", "", d => parseInt(parse("option", "dualstack", d)));

    return objects;
}

function initSystemMessages() {
    const objects = [];

    // use firmware from EM
    // state(objects, "info.firmware", "Firmware Version", "string", "", "info.version", d => parse("value", "firmware_version", d));
    value(objects, "info.bootcode", "Bootcode Version", "string", "", d => parse("value", "bootcode_version", d));
    state(objects, "info.name", "Device Name", "string", "", "info.name", d => parse("value", "device_name", d));
    value(objects, "DSL.modem_version", "DSL Modem Version", "string", "", d => parse("value", "modem_version", d));
    value(objects, "info.hw_revision", "Hardware Revision", "string", "", d => parse("value", "hardware_revision", d));
    value(objects, "info.serial_number", "Serial Number", "string", "", d => parse("value", "serial_number", d));
    value(objects, "DSL.upstream", "DSL Upstream", "number", "", d => parseInt(parse("value", "dsl_upstream", d)));
    value(objects, "DSL.downstream", "DSL Downstream", "number", "", d => parseInt(parse("value", "dsl_downstream", d)));
    value(objects, "info.dect_version", "DECT Version", "number", "", d => parse("value", "dect_version", d));

    return objects;
}

function parseWanUptime(json) {
    const days = parse("value", "days_online", json);
    const time = parse("value", "time_online", json).split(":");

    return parseInt(days) * 60 * 60 * 24 + parseInt(time[0]) * 60 * 60 + parseInt(time[1]) * 60 + parseInt(time[2]);
}

function parse(vartype, varid, json) {
    return sp.findEntry(vartype, varid, json);
}

function value(objects, id, name, datatype, unit, parser) {
    objects.push(new ConfigObject(id, name, datatype, unit, "value", parser));
}

function state(objects, id, name, datatype, unit, role, parser) {
    objects.push(new ConfigObject(id, name, datatype, unit, role, parser));
}

const INetIPConfig = initINetIP();
const SystemMessagesConfig = initSystemMessages();

module.exports = {
    INetIPConfig,
    SystemMessagesConfig,
};