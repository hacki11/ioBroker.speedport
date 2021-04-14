const {ConfigObject} = require("./config");


function initDsl() {
    const objects = [];

    value(objects, "DSL.opmode", "DSL Operating mode", "string", "", d => parse(/dsl_opmode = "\s*(.*)\s*";/, d));
    value(objects, "DSL.pathmode", "DSL Path mode", "number", "", d => parseInt(parse(/dsl_pathmode = "\s*(.*)\s*"/, d)));
    value(objects, "DSL.state", "DSL State", "string", "", d => parse(/dsl_state = "\s*(.*)\s*"/, d));
    value(objects, "DSL.training", "DSL Training results", "string", "", d => parse(/dsl_training = "\s*(.*)\s*"/, d));
    value(objects, "DSL.model", "DSL Model L0/I2", "string", "", d => parse(/dsl_mode = "\s*(.*)\s*"/, d));
    value(objects, "DSL.vpivci", "DSL VPI/VCI", "string", "", d => parse(/dsl_vpivci = "\s*(.*)\s*"/, d));

    value(objects, "DSL.upstream.FEC", "DSL Upstream FEC Size", "number", "", d => parseInt(parse(/upFEC = "\s*(.*)\s*"/, d)));
    value(objects, "DSL.upstream.RETX", "DSL Upstream Retransmission Status", "number", "", d => parseInt(parse(/upRETX = ".*\((\d)\)"/, d)));
    value(objects, "DSL.upstream.bitswap", "DSL Upstream Bitswap Status", "number", "", d => parseInt(parse(/upBitswap = ".*\((\d)\)"/, d)));
    value(objects, "DSL.upstream.actual_data_rate", "DSL Upstream Actual Data Rate", "number", "Kbps", d => parseInt(parse(/upstream_status\[0] = "\s*(.*)\sKbps"/, d)));
    value(objects, "DSL.upstream.attainable_data_rate", "DSL Upstream Attainable Data Rate", "number", "Kbps", d => parseInt(parse(/upstream_status\[1] = "\s*(.*)\sKbps"/, d)));
    value(objects, "DSL.upstream.snr_margin", "DSL Upstream SNR Margin", "number", "dB", d => parseInt(parse(/upstream_status\[2] = "\s*(.*)\sdB"/, d)));
    value(objects, "DSL.upstream.signal_level", "DSL Upstream Signal-level", "number", "dB", d => parseInt(parse(/upstream_status\[3] = "\s*(.*)\sdB"/, d)));
    value(objects, "DSL.upstream.line_attenuation", "DSL Upstream Line Attenuation", "number", "dB", d => parseInt(parse(/upstream_status\[4] = "\s*(.*)\sdB"/, d)));
    value(objects, "DSL.upstream.bin_allocation", "DSL Upstream BIN Allocation", "number", "", d => parseInt(parse(/upstream_status\[5] = "\s*(.*)"/, d)));
    value(objects, "DSL.upstream.codeword_size", "DSL Upstream Codeword Size", "number", "byte", d => parseInt(parse(/upstream_status\[6] = "\s*(.*)\sbytes"/, d)));
    value(objects, "DSL.upstream.interleave_delay", "DSL Upstream Interleave Delay", "number", "ms", d => parseInt(parse(/upstream_status\[7] = "\s*(.*)\sms"/, d)));
    value(objects, "DSL.upstream.crc_error_count", "DSL Upstream CRC Error Count", "number", "", d => parseInt(parse(/upstream_status\[8] = "\s*(.*)"/, d)));
    value(objects, "DSL.upstream.hec_error_count", "DSL Upstream HEC Error Count", "number", "", d => parseInt(parse(/upstream_status\[9] = "\s*(.*)"/, d)));
    value(objects, "DSL.upstream.fec_error_count", "DSL Upstream FEC Error Count", "number", "", d => parseInt(parse(/upstream_status\[10] = "\s*(.*)"/, d)));

    value(objects, "DSL.downstream.actual_data_rate", "DSL Downstream Actual Data Rate", "number", "Kbps", d => parseInt(parse(/downstream_status\[0] = "\s*(.*)\sKbps"/, d)));
    value(objects, "DSL.downstream.attainable_data_rate", "DSL Downstream Attainable Data Rate", "number", "Kbps", d => parseInt(parse(/downstream_status\[1] = "\s*(.*)\sKbps"/, d)));
    value(objects, "DSL.downstream.snr_margin", "DSL Downstream SNR Margin", "number", "dB", d => parseInt(parse(/downstream_status\[2] = "\s*(.*)\sdB"/, d)));
    value(objects, "DSL.downstream.signal_level", "DSL Downstream Signal-level", "number", "dB", d => parseInt(parse(/downstream_status\[3] = "\s*(.*)\sdB"/, d)));
    value(objects, "DSL.downstream.line_attenuation", "DSL Downstream Line Attenuation", "number", "dB", d => parseInt(parse(/downstream_status\[4] = "\s*(.*)\sdB"/, d)));
    value(objects, "DSL.downstream.bin_allocation", "DSL Downstream BIN Allocation", "number", "", d => parseInt(parse(/downstream_status\[5] = "\s*(.*)"/, d)));
    value(objects, "DSL.downstream.codeword_size", "DSL Downstream Codeword Size", "number", "byte", d => parseInt(parse(/downstream_status\[6] = "\s*(.*)\sbytes"/, d)));
    value(objects, "DSL.downstream.interleave_delay", "DSL Downstream Interleave Delay", "number", "ms", d => parseInt(parse(/downstream_status\[7] = "\s*(.*)\sms"/, d)));
    value(objects, "DSL.downstream.crc_error_count", "DSL Downstream CRC Error Count", "number", "", d => parseInt(parse(/downstream_status\[8] = "\s*(.*)"/, d)));
    value(objects, "DSL.downstream.hec_error_count", "DSL Downstream HEC Error Count", "number", "", d => parseInt(parse(/downstream_status\[9] = "\s*(.*)"/, d)));
    value(objects, "DSL.downstream.fec_error_count", "DSL Downstream FEC Error Count", "number", "", d => parseInt(parse(/downstream_status\[10] = "\s*(.*)"/, d)));
    value(objects, "DSL.downstream.FEC", "DSL Downstream FEC Size", "number", "", d => parseInt(parse(/downFEC = "\s*(.*)\s*"/, d)));
    value(objects, "DSL.downstream.RETX", "DSL Downstream Retransmission Status", "number", "", d => parseInt(parse(/downRETX = ".*\((\d)\)"/, d)));
    value(objects, "DSL.downstream.bitswap", "DSL Downstream Bitswap Status", "number", "", d => parseInt(parse(/downBitswap = ".*\((\d)\)"/, d)));

    return objects;
}

function initMemCpuUtilization() {
    const objects = [];

    value(objects, "mem_available", "Available Main Memory", "number", "kB", d => parseInt(parse(/Available Main Memory.*?>(\d+) kB/, d)));
    value(objects, "mem_free", "Free Main Memory", "number", "kB", d => parseInt(parse(/Free Main Memory.*?>(\d+) kB</, d)));
    value(objects, "flash_available", "Available Flash Memory", "number", "kB", d => parseInt(parse(/Available Flash Memory.*?>(\d+) kB/, d)));
    value(objects, "flash_free", "Free Flash Memory", "number", "kB", d => parseInt(parse(/Free Flash Memory.*?>(\d+) kB/, d)));
    value(objects, "cpu_load_user", "CPU Load User", "number", "%", d => parseInt(parse(/CPU-Load User.*?>(\d+)%/, d)));
    value(objects, "cpu_load_system", "CPU Load System", "number", "%", d => parseInt(parse(/CPU-Load System.*?>(\d+)%/, d)));

    return objects;
}

function initInterfaceLan() {
    const objects = [];

    value(objects, "LAN.mac_address", "LAN MAC Address", "string", "", d => parse(/inte_face_mac = "\s*(.*)\s*";/, d));
    value(objects, "LAN.ipv4_address", "LAN IPv4 Address", "string", "", d => parse(/inte_face_ip4 = "\s*(.*)\s*";/, d));
    value(objects, "LAN.ipv4_subnet", "LAN IPv4 Mask", "string", "", d => parse(/inte_face_mask4 = "\s*(.*)\s*";/, d));
    value(objects, "LAN.link_status", "LAN Link Status", "string", "", d => parse(/inte_face_status = "\s*(.*)\s*";/, d));
    value(objects, "LAN.media", "LAN Media", "string", "", d => parse(/inte_face_media = "\s*(.*)\s*";/, d));

    // 4 LAN ports, yes there are negative byte numbers ...
    for (let i = 1; i < 5; i++) {
        value(objects, `LAN.LAN${i}.link_speed`, "LAN1 Link Speed", "number", "Mbits", d => parseInt(parse(`inte_face_speed\\[${i - 1}\\] = (\\d+);`, d)));
        value(objects, `LAN.LAN${i}.tx_packets`, "LAN1 TX Packets", "number", "", d => parseInt(parse(`inte_face_tx\\[${i - 1}\\]\\[0\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.tx_bytes`, "LAN1 TX Bytes", "number", "byte", d => parseInt(parse(`inte_face_tx\\[${i - 1}\\]\\[1\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.tx_errors`, "LAN1 TX Errors", "number", "", d => parseInt(parse(`inte_face_tx\\[${i - 1}\\]\\[2\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.tx_dropped`, "LAN1 TX Dropped", "number", "", d => parseInt(parse(`inte_face_tx\\[${i - 1}\\]\\[3\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.rx_packets`, "LAN1 RX Packets", "number", "", d => parseInt(parse(`inte_face_rx\\[${i - 1}\\]\\[0\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.rx_bytes`, "LAN1 RX Bytes", "number", "byte", d => parseInt(parse(`inte_face_rx\\[${i - 1}\\]\\[1\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.rx_errors`, "LAN1 RX Errors", "number", "", d => parseInt(parse(`inte_face_rx\\[${i - 1}\\]\\[2\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.rx_dropped`, "LAN1 RX Dropped", "number", "", d => parseInt(parse(`inte_face_rx\\[${i - 1}\\]\\[3\\] = ([-]?\\d+);`, d)));
        value(objects, `LAN.LAN${i}.collision`, "LAN1 Collisions", "number", "", d => parseInt(parse(`inte_face_collisions\\[${i - 1}\\] = ([-]?\\d+);`, d)));
    }

    return objects;
}

function initInterfaceWan() {
    const objects = [];

    value(objects, "WAN.interface", "WAN Interface", "string", "", d => parse(/interface_name = "\s*(.*)\s*";/, d));
    value(objects, "WAN.mac_address", "WAN MAC Address", "string", "", d => parse(/inte_face_mac = "\s*(.*)\s*";/, d));
    value(objects, "WAN.media", "WAN Media", "string", "", d => parse(/inte_face_media = "\s*(.*)\s*";/, d));
    value(objects, "WAN.status", "WAN Interface Status", "string", "", d => parse(/inte_face_status = "\s*(.*)\s*";/, d));
    value(objects, "WAN.type", "WAN Interface Type", "number", "", d => parseInt(parse(/inte_face_wantype = "(\d+)";/, d)));
    value(objects, "WAN.ipv4_address", "WAN IPv4 Address", "string", "", d => parse(/inte_face_ip\[0] = "(.*)"/, d));
    value(objects, "WAN.ipv4_subnet", "WAN IPv4 Subnet", "string", "", d => parse(/inte_face_subnet\[0] = "(.*)"/, d));
    value(objects, "WAN.ipv4_gateway", "WAN IPv4 Gateway", "string", "", d => parse(/inte_face_gw_ip4 = '(.*)'/, d));
    value(objects, "WAN.rx_packets", "WAN RX Packets", "number", "", d => parseInt(parse(/inte_face_rx\[0]\[0] = (\d+);/, d)));
    value(objects, "WAN.rx_bytes", "WAN RX Bytes", "number", "byte", d => parseInt(parse(/inte_face_rx\[0]\[1] = (\d+);/, d)));
    value(objects, "WAN.rx_errors", "WAN RX Errors", "number", "", d => parseInt(parse(/inte_face_rx\[0]\[2] = (\d+);/, d)));
    value(objects, "WAN.rx_dropped", "WAN RX Dropped", "number", "", d => parseInt(parse(/inte_face_rx\[0]\[3] = (\d+);/, d)));
    value(objects, "WAN.tx_packets", "WAN TX Packets", "number", "", d => parseInt(parse(/inte_face_tx\[0]\[0] = (\d+);/, d)));
    value(objects, "WAN.tx_bytes", "WAN TX Bytes", "number", "byte", d => parseInt(parse(/inte_face_tx\[0]\[1] = (\d+);/, d)));
    value(objects, "WAN.tx_errors", "WAN TX Errors", "number", "", d => parseInt(parse(/inte_face_tx\[0]\[2] = (\d+);/, d)));
    value(objects, "WAN.tx_dropped", "WAN TX Dropped", "number", "", d => parseInt(parse(/inte_face_tx\[0]\[3] = (\d+);/, d)));
    value(objects, "WAN.collisions", "WAN Collisions", "number", "", d => parseInt(parse(/inte_face_collisions\[0] = (\d+);/, d)));
    value(objects, "WAN.ipv6_ready", "WAN IPv6 Ready", "number", "", d => parseInt(parse(/interface_6_ready = "(\d+)";/, d)));
    value(objects, "WAN.ipv6_address", "WAN IPv6 Address", "string", "", d => parse(/interface_6_ip = "\s*(.*)\s*";/, d));
    value(objects, "WAN.ipv6_prefix", "WAN IPv6 Prefix", "number", "", d => parseInt(parse(/interface_6_prefix_length = (\d+);/, d)));
    value(objects, "WAN.ipv6_gateway", "WAN IPv6 Gateway", "string", "", d => parse(/inte_face_gw_ip6 = '([^-']+)'/, d));
    value(objects, "WAN.ipv6_valid_lifetime", "WAN IPv6 Valid Lifetime", "number", "s", d => parseInt(parse(/interface_6_valid_lifetime = (\d+);/, d)));
    value(objects, "WAN.ipv6_preferred_lifetime", "WAN IPv6 Preferred Lifetime", "number", "s", d => parseInt(parse(/interface_6_preferred_lifetime = (\d+);/, d)));


    return objects;
}

function initModuleVersions() {
    const objects = [];

    state(objects, "info.firmware", "Firmware Version", "string", "", "info.version", d => parse(/sw_ver = "(.+)";/, d));

    return objects;
}

function value(objects, id, name, datatype, unit, parser) {
    objects.push(new ConfigObject(id, name, datatype, unit, "value", parser));
}

function state(objects, id, name, datatype, unit, role, parser) {
    objects.push(new ConfigObject(id, name, datatype, unit, role, parser));
}

function parse(regex, text) {
    const match = text.match(regex);
    if (match) {
        return match[1];
    }
}

const DslConfig = initDsl();
const MemCpuUtilizationConfig = initMemCpuUtilization();
const InterfaceLanConfig = initInterfaceLan();
const InterfaceWanConfig = initInterfaceWan();
const ModuleVersionsConfig = initModuleVersions();

module.exports = {
    DslConfig,
    MemCpuUtilizationConfig,
    InterfaceLanConfig,
    InterfaceWanConfig,
    ModuleVersionsConfig
};