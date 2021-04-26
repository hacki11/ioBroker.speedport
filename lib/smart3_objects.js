const {ConfigObject} = require("./config");
const sp = require("./sputils");

function initPhoneCalls() {
    const objects = [];

    value(objects, "calllists.inbound.json", "Inbound Calls", "string", "", d => parseInboundCalls(d));
    value(objects, "calllists.inbound.count", "Number of Inbound Calls", "number", "", d => countCalls("addtakencalls", d));

    value(objects, "calllists.missed.json", "Missed Calls", "string", "", d => parseMissedCalls(d));
    value(objects, "calllists.missed.count", "Number of Missed Calls", "number", "", d => countCalls("addmissedcalls", d));

    value(objects, "calllists.outbound.json", "Outbound Calls", "string", "", d => parseOutboundCalls(d));
    value(objects, "calllists.outbound.count", "Number of Outbound Calls", "number", "", d => countCalls("adddialedcalls", d));

    return objects;
}

function countCalls(varid, json) {
    const calls = sp.findEntries("template", varid, json);
    return calls.length;
}

function parseOutboundCalls(json) {
    const inboundCalls = sp.findEntries("template", "adddialedcalls", json);

    return JSON.stringify(inboundCalls.map(call => {
        return {
            id: parseInt(sp.findEntry("value", "id", call)),
            date: parseDateTime(sp.findEntry("value", "dialedcalls_date", call), sp.findEntry("value", "dialedcalls_time", call)),
            caller: sp.findEntry("value", "dialedcalls_who", call),
            duration: parseInt(sp.findEntry("value", "dialedcalls_duration", call))
        };
    }));
}

function parseInboundCalls(json) {
    const inboundCalls = sp.findEntries("template", "addtakencalls", json);

    return JSON.stringify(inboundCalls.map(call => {
        return {
            id: parseInt(sp.findEntry("value", "id", call)),
            date: parseDateTime(sp.findEntry("value", "takencalls_date", call), sp.findEntry("value", "takencalls_time", call)),
            caller: sp.findEntry("value", "takencalls_who", call),
            duration: parseInt(sp.findEntry("value", "takencalls_duration", call))
        };
    }));
}

function parseMissedCalls(json) {
    const missedCalls = sp.findEntries("template", "addmissedcalls", json);

    return JSON.stringify(missedCalls.map(call => {
        return {
            id: parseInt(sp.findEntry("value", "id", call)),
            date: parseDateTime(sp.findEntry("value", "missedcalls_date", call), sp.findEntry("value", "missedcalls_time", call)),
            caller: sp.findEntry("value", "missedcalls_who", call),
            called: sp.findEntry("value", "missedcalls_for", call)
        };
    }));
}
Date.prototype.getISOTimezoneOffset = function () {
    const offset = this.getTimezoneOffset();
    return (offset < 0 ? "+" : "-") + Math.floor(Math.abs(offset / 60)).leftPad(2) + ":" + (Math.abs(offset % 60)).leftPad(2);
};

Date.prototype.toISOLocaleString = function () {
    return this.getFullYear() + "-" + (this.getMonth() + 1).leftPad(2) + "-" +
        this.getDate().leftPad(2) + "T" + this.getHours().leftPad(2) + ":" +
        this.getMinutes().leftPad(2) + ":" + this.getSeconds().leftPad(2);
};

Date.prototype.toISOOffsetString = function () {
    return this.toISOLocaleString() + this.getISOTimezoneOffset();
};

Number.prototype.leftPad = function (size) {
    let s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};
function parseDateTime(date, time) {

    const dArray = date.split(".");
    const tArray = time.split(":");

    const dateTime = new Date(2000 + parseInt(dArray[2]), parseInt(dArray[1])-1, parseInt(dArray[0]), parseInt(tArray[0]), parseInt(tArray[1]), parseInt(tArray[2]));

    return dateTime.toISOOffsetString();
}

function DeviceListConfig(json) {
    const objects = [];

    const devices = sp.findEntries("template", "addmdevice", json);
    devices.map(device => parseLanDevice(objects, device));

    const landevices = sp.findEntries("template", "addmlandevice", json);
    landevices.map(device => parseLanDevice(objects, device));

    const wlandevices = sp.findEntries("template", "addmwlandevice", json);
    wlandevices.map(device => parseWLanDevice(objects, device, 2.4));

    const wlan5devices = sp.findEntries("template", "addmwlan5device", json);
    wlan5devices.map(device => parseWLanDevice(objects, device, 5));

    return objects;
}

function parseLanDevice(objects, device) {

    const mac = parseDevice(objects, device);
    valueDynamic(objects, `clients.${mac}.is_wired`, "Is Wired", "boolean", "", () => true);
}

function parseWLanDevice(objects, device, channel) {

    const mac = parseDevice(objects, device);
    valueDynamic(objects, `clients.${mac}.is_wired`, "Is Wired", "boolean", "", () => false);
    valueDynamic(objects, `clients.${mac}.channel`, "Wifi Channel", "number", "GHz", () => channel);
    valueDynamic(objects, `clients.${mac}.rssi`, "RSSI", "number", "dB", () => parseInt(sp.findEntry("value", "mdevice_rssi", device)));
}

function parseDevice(objects, device) {
    const name = sp.findEntry("value", "mdevice_name", device);
    const mac = sp.findEntry("value", "mdevice_mac", device);
    const use_dhcp = parseInt(sp.findEntry("value", "mdevice_use_dhcp", device));
    const is_online = parseInt(sp.findEntry("value", "mdevice_connected", device)) === 1;
    const ip = sp.findEntry("value", "mdevice_ipv4", device);
    let ipv6 = sp.findEntry("value", "mdevice_gua_ipv6", device);
    if (ipv6 === "-")
        ipv6 = "";

    valueDynamic(objects, `clients.${mac}`, name, "string", "", () => "");
    valueDynamic(objects, `clients.${mac}.mac`, "Name", "string", "", () => mac);
    valueDynamic(objects, `clients.${mac}.name`, "Name", "string", "", () => name);
    valueDynamic(objects, `clients.${mac}.use_dhcp`, "Used DHCP", "number", "", () => use_dhcp);
    valueDynamic(objects, `clients.${mac}.downspeed`, "Downlink Speed", "number", "MBit/s", () => parseInt(sp.findEntry("value", "mdevice_downspeed", device)) / 1000 / 1000);
    valueDynamic(objects, `clients.${mac}.upspeed`, "Uplink Speed", "number", "MBit/s", () => parseInt(sp.findEntry("value", "mdevice_upspeed", device)) / 1000 / 1000);
    valueDynamic(objects, `clients.${mac}.is_online`, "Is Online", "boolean", "", () => is_online);
    valueDynamic(objects, `clients.${mac}.ip`, "IP Address", "string", "", () => ip);
    valueDynamic(objects, `clients.${mac}.ipv6`, "IPv6 Address", "string", "", () => ipv6);

    return mac;
}

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
    objects.push(new ConfigObject(id, name, false, datatype, unit, "value", parser));
}

function valueDynamic(objects, id, name, datatype, unit, parser) {
    objects.push(new ConfigObject(id, name, true, datatype, unit, "value", parser));
}

function state(objects, id, name, datatype, unit, role, parser) {
    objects.push(new ConfigObject(id, name, false, datatype, unit, role, parser));
}

const INetIPConfig = initINetIP();
const SystemMessagesConfig = initSystemMessages();
const PhoneCallsConfig = initPhoneCalls();

module.exports = {
    INetIPConfig,
    SystemMessagesConfig,
    DeviceListConfig,
    PhoneCallsConfig,
};