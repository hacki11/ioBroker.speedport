const {ConfigObject} = require("./config");


function initDsl() {
    const objects = [];

    value(objects, "DSL.opmode", "DSL Operating mode", "string", "", /dsl_opmode = "\s*(.*)\s*";/);
    value(objects, "DSL.pathmode", "DSL Path mode", "number", "", /dsl_pathmode = "\s*(.*)\s*"/);
    value(objects, "DSL.state", "DSL State", "string", "", /dsl_state = "\s*(.*)\s*"/);
    value(objects, "DSL.training", "DSL Training results", "string", "", /dsl_training = "\s*(.*)\s*"/);
    value(objects, "DSL.mode", "DSL Model L0/I2", "string", "", /dsl_mode = "\s*(.*)\s*"/);
    value(objects, "DSL.vpivci", "DSL VPI/VCI", "string", "", /dsl_vpivci = "\s*(.*)\s*"/);

    value(objects, "DSL.upstream.FEC", "DSL Upstream FEC Size", "number", "", /upFEC = "\s*(.*)\s*"/);
    value(objects, "DSL.upstream.RETX", "DSL Upstream Retransmission Status", "number", "", /upRETX = ".*\((\d)\)"/);
    value(objects, "DSL.upstream.bitswap", "DSL Upstream Bitswap Status", "number", "", /upBitswap = ".*\((\d)\)"/);
    value(objects, "DSL.upstream.actual_data_rate", "DSL Upstream Actual Data Rate", "number", "Kbps", /upstream_status\[0] = "\s*(.*)\sKbps"/);
    value(objects, "DSL.upstream.attainable_data_rate", "DSL Upstream Attainable Data Rate", "number", "Kbps", /upstream_status\[1] = "\s*(.*)\sKbps"/);
    value(objects, "DSL.upstream.snr_margin", "DSL Upstream SNR Margin", "number", "dB", /upstream_status\[2] = "\s*(.*)\sdB"/);
    value(objects, "DSL.upstream.signal_level", "DSL Upstream Signal-level", "number", "dB", /upstream_status\[3] = "\s*(.*)\sdB"/);
    value(objects, "DSL.upstream.line_attenuation", "DSL Upstream Line Attenuation", "number", "dB", /upstream_status\[4] = "\s*(.*)\sdB"/);
    value(objects, "DSL.upstream.bin_allocation", "DSL Upstream BIN Allocation", "number", "", /upstream_status\[5] = "\s*(.*)"/);
    value(objects, "DSL.upstream.codeword_size", "DSL Upstream Codeword Size", "number", "byte", /upstream_status\[6] = "\s*(.*)\sbytes"/);
    value(objects, "DSL.upstream.interleave_delay", "DSL Upstream Interleave Delay", "number", "ms", /upstream_status\[7] = "\s*(.*)\sms"/);
    value(objects, "DSL.upstream.crc_error_count", "DSL Upstream CRC Error Count", "number", "", /upstream_status\[8] = "\s*(.*)"/);
    value(objects, "DSL.upstream.hec_error_count", "DSL Upstream HEC Error Count", "number", "", /upstream_status\[9] = "\s*(.*)"/);
    value(objects, "DSL.upstream.fec_error_count", "DSL Upstream FEC Error Count", "number", "", /upstream_status\[10] = "\s*(.*)"/);

    value(objects, "DSL.downstream.actual_data_rate", "DSL Downstream Actual Data Rate", "number", "Kbps", /downstream_status\[0] = "\s*(.*)\sKbps"/);
    value(objects, "DSL.downstream.attainable_data_rate", "DSL Downstream Attainable Data Rate", "number", "Kbps", /downstream_status\[1] = "\s*(.*)\sKbps"/);
    value(objects, "DSL.downstream.snr_margin", "DSL Downstream SNR Margin", "number", "dB", /downstream_status\[2] = "\s*(.*)\sdB"/);
    value(objects, "DSL.downstream.signal_level", "DSL Downstream Signal-level", "number", "dB", /downstream_status\[3] = "\s*(.*)\sdB"/);
    value(objects, "DSL.downstream.line_attenuation", "DSL Downstream Line Attenuation", "number", "dB", /downstream_status\[4] = "\s*(.*)\sdB"/);
    value(objects, "DSL.downstream.bin_allocation", "DSL Downstream BIN Allocation", "number", "", /downstream_status\[5] = "\s*(.*)"/);
    value(objects, "DSL.downstream.codeword_size", "DSL Downstream Codeword Size", "number", "byte", /downstream_status\[6] = "\s*(.*)\sbytes"/);
    value(objects, "DSL.downstream.interleave_delay", "DSL Downstream Interleave Delay", "number", "ms", /downstream_status\[7] = "\s*(.*)\sms"/);
    value(objects, "DSL.downstream.crc_error_count", "DSL Downstream CRC Error Count", "number", "", /downstream_status\[8] = "\s*(.*)"/);
    value(objects, "DSL.downstream.hec_error_count", "DSL Downstream HEC Error Count", "number", "", /downstream_status\[9] = "\s*(.*)"/);
    value(objects, "DSL.downstream.fec_error_count", "DSL Downstream FEC Error Count", "number", "", /downstream_status\[10] = "\s*(.*)"/);
    value(objects, "DSL.downstream.FEC", "DSL Downstream FEC Size", "number", "", /downFEC = "\s*(.*)\s*"/);
    value(objects, "DSL.downstream.RETX", "DSL Downstream Retransmission Status", "number", "", /downRETX = ".*\((\d)\)"/);
    value(objects, "DSL.downstream.bitswap", "DSL Downstream Bitswap Status", "number", "", /downBitswap = ".*\((\d)\)"/);

    return objects;
}

function initMemCpuUtilization() {
    const objects = [];

    value(objects, "mem_available", "Available Main Memory", "number", "kB", /Available Main Memory.*?>(\d+) kB/);
    value(objects, "mem_free", "Free Main Memory", "number", "kB", /Free Main Memory.*?>(\d+) kB</);
    value(objects, "flash_available", "Available Flash Memory", "number", "kB", /Available Flash Memory.*?>(\d+) kB/);
    value(objects, "flash_free", "Free Flash Memory", "number", "kB", /Free Flash Memory.*?>(\d+) kB/);
    value(objects, "cpu_load_user", "CPU Load User", "number", "%", /CPU-Load User.*?>(\d+)%/);
    value(objects, "cpu_load_system", "CPU Load User", "number", "%", /CPU-Load System.*?>(\d+)%/);

    return objects;
}

function initInterfaceLan() {
    const objects = [];

    value(objects, "LAN.mac_address", "LAN MAC Address", "string", "", /inte_face_mac = "\s*(.*)\s*";/);
    value(objects, "LAN.ipv4_address", "LAN IPv4 Address", "string", "", /inte_face_ip4 = "\s*(.*)\s*";/);
    value(objects, "LAN.ipv4_subnet", "LAN IPv4 Mask", "string", "", /inte_face_mask4 = "\s*(.*)\s*";/);
    value(objects, "LAN.link_status", "LAN Link Status", "string", "", /inte_face_status = "\s*(.*)\s*";/);
    value(objects, "LAN.media", "LAN Media", "string", "", /inte_face_media = "\s*(.*)\s*";/);

    // 4 LAN ports, yes there are negative byte numbers ...
    for (let i = 1; i < 5; i++) {
        value(objects, `LAN.LAN${i}.link_speed`, "LAN1 Link Speed", "number", "Mbits", `inte_face_speed\\[${i - 1}\\] = (\\d+);`);
        value(objects, `LAN.LAN${i}.tx_packets`, "LAN1 TX Packets", "number", "", `inte_face_tx\\[${i - 1}\\]\\[0\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.tx_bytes`, "LAN1 TX Bytes", "number", "byte", `inte_face_tx\\[${i - 1}\\]\\[1\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.tx_errors`, "LAN1 TX Errors", "number", "", `inte_face_tx\\[${i - 1}\\]\\[2\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.tx_dropped`, "LAN1 TX Dropped", "number", "", `inte_face_tx\\[${i - 1}\\]\\[3\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.rx_packets`, "LAN1 RX Packets", "number", "", `inte_face_rx\\[${i - 1}\\]\\[0\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.rx_bytes`, "LAN1 RX Bytes", "number", "byte", `inte_face_rx\\[${i - 1}\\]\\[1\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.rx_errors`, "LAN1 RX Errors", "number", "", `inte_face_rx\\[${i - 1}\\]\\[2\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.rx_dropped`, "LAN1 RX Dropped", "number", "", `inte_face_rx\\[${i - 1}\\]\\[3\\] = ([-]?\\d+);`);
        value(objects, `LAN.LAN${i}.collision`, "LAN1 Collisions", "number", "", `inte_face_collisions\\[${i - 1}\\] = ([-]?\\d+);`);
    }

    return objects;
}

function initInterfaceWan() {
    const objects = [];

    value(objects, "WAN.mac_address", "WAN MAC Address", "string", "", /inte_face_mac = "\s*(.*)\s*";/);
    value(objects, "WAN.media", "WAN Media", "string", "", /inte_face_media = "\s*(.*)\s*";/);
    value(objects, "WAN.link_status", "WAN Link Status", "string", "", /inte_face_status = "\s*(.*)\s*";/);
    value(objects, "WAN.ipv4_address", "WAN IPv4 Address", "string", "", /inte_face_ip\[0] = "(.*)"/);
    value(objects, "WAN.ipv4_subnet", "WAN IPv4 Subnet", "string", "", /inte_face_subnet\[0] = "(.*)"/);
    value(objects, "WAN.rx_packets", "WAN RX Packets", "number", "", /inte_face_rx\[0]\[0] = (\d+);/);
    value(objects, "WAN.rx_bytes", "WAN RX Bytes", "number", "byte", /inte_face_rx\[0]\[1] = (\d+);/);
    value(objects, "WAN.rx_errors", "WAN RX Errors", "number", "", /inte_face_rx\[0]\[2] = (\d+);/);
    value(objects, "WAN.rx_dropped", "WAN RX Dropped", "number", "", /inte_face_rx\[0]\[3] = (\d+);/);
    value(objects, "WAN.tx_packets", "WAN TX Packets", "number", "", /inte_face_tx\[0]\[0] = (\d+);/);
    value(objects, "WAN.tx_bytes", "WAN TX Bytes", "number", "byte", /inte_face_tx\[0]\[1] = (\d+);/);
    value(objects, "WAN.tx_errors", "WAN TX Errors", "number", "", /inte_face_tx\[0]\[2] = (\d+);/);
    value(objects, "WAN.tx_dropped", "WAN TX Dropped", "number", "", /inte_face_tx\[0]\[3] = (\d+);/);
    value(objects, "WAN.collisions", "WAN Collisions", "number", "", /inte_face_collisions\[0] = (\d+);/);

    return objects;
}

function initModuleVersions() {
    const objects = [];

    state(objects, "firmware", "Firmware Version", "string", "", "info.version", /sw_ver = "(.*)";/);

    return objects;
}

function value(objects, id, name, datatype, unit, regex) {
    objects.push(new ConfigObject(id, name, datatype, unit, "value", regex));
}

function state(objects, id, name, datatype, unit, role, regex) {
    objects.push(new ConfigObject(id, name, datatype, unit, role, regex));
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