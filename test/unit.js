const qs = require("qs");
const path = require("path");
const {tests} = require("@iobroker/testing");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
// @ts-ignore
const mock = new MockAdapter(axios);
const {expect} = require("chai");
const W925V = require(__dirname + "/../lib/w925v");
const fs = require("fs");

describe("W925V => getInterfaceLan", () => {
    const sp = new W925V("http://host", "dummy");

    it(`should return non null values`, async () => {

        prepareMock("interfaces_hidden_lan.stm");
        return sp.getInterfaceLan()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("W925V => getInterfacesWan", () => {
    const sp = new W925V("http://host", "dummy");

    prepareMock("interfaces_hidden_wan.stm");
    it(`should return non null values`, () => {
        return sp.getInterfaceWan()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("W925V => getDsl", () => {
    const sp = new W925V("http://host", "dummy");

    prepareMock("dsl_hidden_status.stm");
    it(`should return non null values`, () => {
        return sp.getDsl()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("W925V => getMemCpuUtilization", () => {
    const sp = new W925V("http://host", "dummy");

    it(`should return non null values`, () => {

        prepareMock("mem_cpu_utilization.stm");
        return sp.getMemCpuUtilization()
            .then(metrics => assertMetricsNotNull(metrics));
    });
});

describe("W925V => getHttoken", () => {
    const sp = new W925V("http://host", "dummy");
    const expected = "1143855916";

    it(`should return ${expected}`, () => {
        const data = fs.readFileSync(__dirname + "/w925v/index.html", "utf-8");
        mock.onGet("http://host").reply(200, data, []);

        return sp.getHttoken()
            .then(token => expect(token).to.be.equal(expected));
    });
});

describe("W925V => getChallenge", () => {
    const sp = new W925V("http://host", "dummy");
    const expected = "2BD97A8473D3D530005629DB7ADFDE2E93BF7DC963E181F89AB5B9148B81BBB6";

    it(`should return ${expected}`, () => {
        const response = JSON.parse("[{\"vartype\":\"status\",\"varid\":\"status\",\"varvalue\":\"ok\"},{\"vartype\":\"value\",\"varid\":\"challenge\",\"varvalue\":\"2BD97A8473D3D530005629DB7ADFDE2E93BF7DC963E181F89AB5B9148B81BBB6\"}]\n");
        mock.onPost("http://host/data/Login.json", qs.stringify({
            "getChallenge": "1",
            "httoken": 1234
        })).reply(200, response, []);
        return sp.getChallenge(1234)
            .then(challenge => expect(challenge).to.be.equal(expected));
    });
});

describe("W925V => sendLogin", () => {
    const sp = new W925V("http://host", "dummy");

    it(`should return successful`, () => {

        const response = [
            {vartype: "status", varid: "status", varvalue: "ok"},
            {vartype: "status", varid: "login", varvalue: "success"},
            {vartype: "value", varid: "router_state", varvalue: "MODEM"},
            {vartype: "value", varid: "bngscrat", varvalue: "0"},
            {vartype: "value", varid: "acsreach", varvalue: "0"},
            {vartype: "value", varid: "acsredir", varvalue: ""},
            {vartype: "value", varid: "provis_inet", varvalue: "000"},
            {vartype: "value", varid: "provis_voip", varvalue: "000"},
            {vartype: "value", varid: "save_fails", varvalue: "0"},
            {vartype: "value", varid: "dsl_link_status", varvalue: "online"},
            {vartype: "option", varid: "askAssist", varvalue: "0"},
            {vartype: "option", varid: "dontstartAssist", varvalue: "1"},
            {vartype: "option", varid: "internetFinished", varvalue: "0"},
            {vartype: "option", varid: "phoneFinished", varvalue: "0"},
            {vartype: "option", varid: "wlanFinished", varvalue: "0"},
            {vartype: "option", varid: "isp_selection", varvalue: "0"},
            {vartype: "value", varid: "t_callident", varvalue: ""},
            {vartype: "value", varid: "t_number", varvalue: ""},
            {vartype: "value", varid: "t_password", varvalue: ""},
            {vartype: "value", varid: "bngscrat", varvalue: "0"},
            {vartype: "value", varid: "acsreach", varvalue: "0"},
            {vartype: "value", varid: "acsredir", varvalue: ""}
        ];

        mock.onPost("http://host/data/Login.json", qs.stringify({
            password: 12345,
            showpw: 0,
            httoken: 1337
        })).reply(200, response, []);
        return sp.sendLogin(12345, 1337);
    });
});

describe("W925V => hashPassword", () => {
    const sp = new W925V("http://host", "totallySecure!");
    const expected = "1ab34f298379c8f319c127769db84092826ffa834cffb3fd0261e82ed09ccb7f";

    it(`should return hash`, () => {
        const challenge = "cool-water";

        const hash = sp.hashPassword(challenge);
        expect(hash).to.be.equal(expected);
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


