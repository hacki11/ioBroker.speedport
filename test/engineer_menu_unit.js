const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
// @ts-ignore
const mock = new MockAdapter(axios);
const {expect} = require("chai");
const EngineerMenu = require(__dirname + "/../lib/engineer_menu");
const fs = require("fs");

describe("EngineerMenu => getInterfaceLan", () => {
    const em = new EngineerMenu("http://host", {});

    it(`should return non null values`, async () => {

        prepareMock("interfaces_hidden_lan.stm");
        return em.getInterfaceLan()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("EngineerMenu => getInterfacesWan", () => {
    const em = new EngineerMenu("http://host", {});

    prepareMock("interfaces_hidden_wan.stm");
    it(`should return non null values`, () => {
        return em.getInterfaceWan()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("EngineerMenu => getDsl", () => {
    const em = new EngineerMenu("http://host", {});

    prepareMock("dsl_hidden_status.stm");
    it(`should return non null values`, () => {
        return em.getDsl()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("EngineerMenu => getMemCpuUtilization", () => {
    const em = new EngineerMenu("http://host", {});

    it(`should return non null values`, () => {

        prepareMock("mem_cpu_utilization.stm");
        return em.getMemCpuUtilization()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

function assertMetricsNotNull(metrics) {
    for (const metric of metrics) {
        if (metric.value == null) {
            console.log(metric.id);
        }
        expect(metric.value).is.not.null;
    }
}

function prepareMock(page) {
    const data = fs.readFileSync(__dirname + "/w925v/" + page, "utf-8");
    mock.onGet("http://host/engineer/html/" + page).reply(200, data, []);
}



