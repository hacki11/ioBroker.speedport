const qs = require("qs");
const path = require("path");
const {tests} = require("@iobroker/testing");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
// @ts-ignore
const mock = new MockAdapter(axios);
const chai = require("chai"),
    expect = chai.expect;
chai.use(require("chai-like"));
chai.use(require("chai-things")); // Don't swap these two
const W925V = require(__dirname + "/../lib/w925v");
const Smart3 = require(__dirname + "/../lib/smart3");
const EngineerMenu = require(__dirname + "/../lib/engineer_menu");
const fs = require("fs");
const sputils = require("../lib/sputils");

describe("Smart3", () => {

    it(`decrypt() should decrypt the login no.1 (get challenge) request correctly`, () => {
        const sp = new Smart3("http://host", "dummy");
        const expectedPlainText = "getChallenge=1&httoken=2022817050";

        const actual = sp.decrypt("a5d04ace82acece61d3a01f7c2613adf58ccd0af44c9345dca9f7c2aaab2749d8c45f1ea4442e18f4e48d769d1080b2793", "");
        expect(actual).to.be.equal(expectedPlainText);
    });

    it(`decrypt() should decrypt the login no.2 (send password) request correctly`, () => {
        const sp = new Smart3("http://host", "dummy");
        const cipherText = "371ccdf4facc0f8b565ecf951f01a71a3bb8c50034ce1a4fd389e991d10c58bba08beeb501b420ff47faaf872da7be72e499ee2ce06464b1b16da2fde650489a869c57dc40abc93e174d132f1d8f9c73b94cc4aae0f40c09c223871f62fcfb862ae6b7845713ae2cf26b2d225461bf04d123923f97";
        const challenge = "C9EAEB1CCA2FBB6DE0C3BC0965E3FBBC883BAD8B430CB499791EFC69BCA1D59C";
        const expectedPlainText = "password=da4a07a5d44c7d0766dcc0396341e4ce1e7bb8f591c3546534141582dc729fd1&showpw=0&httoken=2022817050";

        const actual = sp.decrypt(cipherText, challenge);
        expect(actual).to.be.equal(expectedPlainText);
    });

    it(`decrypt() should decrypt the login no.3 (get next challenge #2) correctly`, () => {
        const sp = new Smart3("http://host", "dummy");
        const cipherText = "2018cac4e5c211830e54c9c44300b6137aa89e5f3297434dd48dedcd835858bda9dc2cf91842d17804df3f05f5c484f5c5";
        const challenge = "C9EAEB1CCA2FBB6DE0C3BC0965E3FBBC883BAD8B430CB499791EFC69BCA1D59C";
        const expectedPlainText = "getChallenge=1&httoken=2022817050";

        const actual = sp.decrypt(cipherText, challenge);
        expect(actual).to.be.equal(expectedPlainText);
    });


    it(`decrypt() should decrypt the login no.4 (send password, second attempt) request correctly`, () => {
        const sp = new Smart3("http://host", "dummy");
        const cipherText = "e32111821872de340369fbc443194e5e5ab95be011ec2af2429e438db2305c8ec0419432e5abc80a6e4d1f9aa2c2f17edc3c2eed5c4c196320dd7f68d5534fba34a7273739ad4c4cdb90d71cb5479cf7ba89b08d54606a4746a09d1d47a913a0b5f8ef609816f8fbf0a24dca1e3dba56a73bdd2fa0";
        const challenge = "AF22090AA85785D29936E4FA641075E8789C0DC8D4054708E241152897B94D35";
        const expectedPlainText = "password=973796d633d8e1597f07098a80515630a238c4ccf6d94c48d870ec92379cf0b9&showpw=0&httoken=2022817050";

        const actual = sp.decrypt(cipherText, challenge);
        expect(actual).to.be.equal(expectedPlainText);
    });

    // it(`should decrypt the SecureStatus.json (send password, second attempt) request correctly`, () => {
    //
    //     const cipherText = fs.readFileSync(__dirname + "/smart3/data_LAN.json", "utf-8");
    //     ;
    //     const challenge = "AF22090AA85785D29936E4FA641075E8789C0DC8D4054708E241152897B94D35";
    //     const expectedPlainText = "password=973796d633d8e1597f07098a80515630a238c4ccf6d94c48d870ec92379cf0b9&showpw=0&httoken=2022817050";
    //
    //     const actual = sp.decrypt(cipherText, challenge);
    //     expect(actual).to.be.equal(expectedPlainText);
    // });

    it(`encrypt() should encrypt the login request correctly`, () => {
        const sp = new Smart3("http://host", "dummy");
        const challenge = "C9EAEB1CCA2FBB6DE0C3BC0965E3FBBC883BAD8B430CB499791EFC69BCA1D59C";
        const plainText = qs.stringify({
            password: "da4a07a5d44c7d0766dcc0396341e4ce1e7bb8f591c3546534141582dc729fd1",
            showpw: 0,
            httoken: 2022817050
        });
        const cipherText = "371ccdf4facc0f8b565ecf951f01a71a3bb8c50034ce1a4fd389e991d10c58bba08beeb501b420ff47faaf872da7be72e499ee2ce06464b1b16da2fde650489a869c57dc40abc93e174d132f1d8f9c73b94cc4aae0f40c09c223871f62fcfb862ae6b7845713ae2cf26b2d225461bf04d123923f97";

        const actual = sp.encrypt(plainText, challenge);
        expect(actual).to.be.equal(cipherText);
    });

    it(`encrypt() should encrypt the challenge request correctly`, () => {
        const sp = new Smart3("http://host", "dummy");
        const plainText = "getChallenge=1&httoken=2022817050";
        const cipherText = "a5d04ace82acece61d3a01f7c2613adf58ccd0af44c9345dca9f7c2aaab2749d8c45f1ea4442e18f4e48d769d1080b2793";

        const actual = sp.encrypt(plainText, "");
        expect(actual).to.be.equal(cipherText);
    });

    it(`getChallenge() should send encrypted challenge request, decrypt response and extract challenge #1`, async () => {
        const sp = new Smart3("http://host", "dummy");
        const httoken = "2022817050";
        const response = "99CE1CFB8BBFF4F3083144A8DD2368D658CDCCE60D857F0E88C42A30A1A737DCDD59495322128F0A4089A14CF7420B8CD63F4DD1FA87A2A9CB7F3ADD8426E4ECE093D6DFC9105861F515E50A46582ACF000C1A4E969735D28FFB12B72E3382DCEA7D90FEBBF95A06773C2F754A866A6162ACAF2C5D9B1DEBD5C148C91DB0AC61ED4E95AA82CCB9E74B09E497F2269032D0041C130613AB471142ADB3B94E9BA8EA326A191AE823AA644B7CB410BC46E3AF3BDFBF5732FD46AE38CB4592";
        mock.onPost("http://host/data/Login.json", "a5d04ace82acece61d3a01f7c2613adf58ccd0af44c9345dca9f7c2aaab2749d8c45f1ea4442e18f4e48d769d1080b2793").reply(200, response, []);

        const expectedChallenge = "C9EAEB1CCA2FBB6DE0C3BC0965E3FBBC883BAD8B430CB499791EFC69BCA1D59C";

        return sp.getChallenge(httoken)
            .then(actual => expect(actual).to.be.equal(expectedChallenge));
    });

    it(`getChallenge() should extract challenge #2 correctly`, async () => {
        const sp = new Smart3("http://host", "dummy");
        const httoken = "2022817050";
        const response = "99CE1CFB8BBFF4F3083144A8DD2368D658CDCCE60D857F0E88C42A30A1A737DCDD59495322128F0A4089A14CF7420B8CD63F4DD1FA87A2A9CB7F3ADD8426E4ECE093D6DFC9105861F515E50A46582ACF000C1A4E969735D28FFB12B72E3382DCEA7D90FEBBF95A06773C2D0A3DF51F1A63AEAD555AEA679CA7B734C06DB5AB169B3695ABF6CFC8904C72EB97F827E132AB7E6C140665DD441843DFB8BC3AECDEEE33116D19E053DB6E3D7CB4106F6DFF0BB6414D07E474A9413C07F20F";
        mock.onPost("http://host/data/Login.json", "2018cac4e5c211830e54c9c44300b6137aa89e5f3297434dd48dedcd835858bda9dc2cf91842d17804df3f05f5c484f5c5").reply(200, response, []);

        const expectedChallenge = "AF22090AA85785D29936E4FA641075E8789C0DC8D4054708E241152897B94D35";
        sp.challenge = "C9EAEB1CCA2FBB6DE0C3BC0965E3FBBC883BAD8B430CB499791EFC69BCA1D59C";

        return sp.getChallenge(httoken)
            .then(actual => expect(actual).to.be.equal(expectedChallenge));
    });

    it(`getHttoken() should extract httoken`, async () => {
        const response = fs.readFileSync(__dirname + "/smart3/html_login_index.html", "utf-8");
        mock.onGet("host", []).reply(200, response, []);
        const expected = "2022817050";
        return sputils.getHttoken(axios.create(), "host")
            .then(actual => {
                console.log(actual);
                expect(actual).to.be.equal(expected);
            });
    });

    it(`sendLogin() should send encrypted login request and validates response`, async () => {
        const sp = new Smart3("http://host", "dummy");

        const response = "99CE1CFB8BBFF4F3083144A8DD2368D658CDCCE60D857F0E88C42A30A1A737DCDD59495322128F0A4089A14CF7420B8CD63F4DD1FA87A2A9CB7F3ADD8426E4ECE093D6DADC1D5971A41BEB5E514B31C24614020F92993ED784B759F07A7ED2DCEA6393FAF5B61D57387D0F297CB40D5E7F94CE1B0EAF2BD093E02FC37CF58F4EA81281B3E5899ED7602EFE95E316BE039C235A7F452488074D59B6A8FE6AAF9DBD675D3F79E345D0162A23E536DF5D485FD50880D91980F47CC7AD273DDD5EDA592708135783CFAE4FBE8F604894300DED1B145F75D4900D3F5067CD915704AE4E86E1B7DD500265A8E1F497EFA2109D42C60D26CBCA4E15421E74F310BFA6DBFF4B2F877FE65F80DCF17343A01D4E784A9CF5D09A3265E3FD2DE91EDD7BA42DEA862A9966527ADA168F7DB90DAEB5C814FD0D2ED1068B9F013E47873F0532E4C94947765854B596F5F7BC1064FB8E71B9F332041C98D61BE986D7DF8876218063DC871453886FB7C6A00C1F029942300DDE55D2ADEA4F1794D2D82BF83D65D8784D772723D4A8C9A0F8F7A7305CF2C4E7297D133C42A4893A37E92EB132479A376BEA335497709639EBEAFD848CC6BD0AC92C4A51A4B13ACA5B930692292EF5153094082CF2B94A2007DC46382C812FB4DEBAE592A54EA46039ADBB02634E85FD927B9567D788C74AED01F07EC301FA7F6C717D37E7FD1296931DAED8C66503827142ABDBDF014C3DD91DA1DAE09F10BB24ACF68C90F159365B20FC2531FAF4F1C546CDD98CD9EF185CA318399B1EE9990D8B12F1915940C58A5146B226C6F966754542DA88D7A1D6DB21810B984CFCCE20CD4695A62282D8F8A44E743021F03CBDADBC3BA55EC3248B19ABC9BDC276DDF784452D249844BA42CFBF743F6330984654753F68C40B87CBD94D7A7EC65C36DF8768349FA9F5149B1A1090F7338957AD89E782E0D0ADF82C472B82DE1205B7DEB8CBF281A03EE4BE87F031C91CB154433E93116D76BDEBE72CC24DB3C22B7E11764FD2562FF055ADA90F3216DF79CC9FD8B485C5A576662CC56081DA014B2BB7EC3B01489B887F7736022C3D12173C0A6880ED42920205E7565A255111F833EC8B81729D229E1069C55025DDD74EA595B1A1942CD2E43661FE2B3BBEAACC31A18BC90C079C66DA69B24CBCCEC419540E6BAEDA02FDA20B2AA6A712E8620E2212F66F1C93E7D960C56683782BE700F36B040D5F42F13570F4ED776717F653F74E2AE65F54BBAC98BBFBDE823D46D0E1523987545615644E709A1AC5A91253DBD692B8D3390725C7906380839CA19CA1BA1D4B13B00C00989B2F4E29D4F6FED76674F44B27BB65C514C8A6CF1807B6287F2BD9AEC0C90428DB5C74A8A3E23E5D88CBCCD106C78359772DDB175229887EF20DA459785346556D75700895C67ECC8B7B4DB8EC31E95F19DBA77BEB0B64AC28BB53507357258E99C36AA75C0383F9A449F3839E524E72E688BED09BDB964803318851E54E07C74BDC47F813A53416E08F18F90BA34F78AADEC979E06140404E9985722992D63FAEDC04F3D25146AA177274DFFF8C9807469A4CC74471A6702E5425213100D8A967A8C52834BE083811D4D593FDB0F842456C7D0DB27D2B02271526A635BFA659C91F411C87E28620A7A8A6F166E8394F6017AB223E6E644354B82B4B8C85F00DA0E85C77E09EFBDA48475299EB72AF27A0CF23D1BEAEDDD15BE7A25C61A1ED4384165FEB2C115677C9F92B1BEB812757BF8C6E5BC13ACE9756CBF14D9E012CA82DA91D83EBE4BFB4C56C73F78C3DE4ECF9F7C61BB9FD628B279D0A26B663A0E28DFA96B2AB37A03172C90E0F0A759EF57A7BAFC0EB5818099405CEA751EF3E648A54AA50F8143BFB9A69832E174683FA1B0A968BDEFD156539AE814C6734890A9F9B97F473D0053D751DBB0FCF9889B71D067D6210D54B68A286A1D6BB61506AB7D97F41F805B6C7C1318E492DF2422B9777F170DEB985F5EC64805BC07509BA3D6A8EDBE7F6D12C3962E928C310EABA82BF686C2830";

        //plaintext: "password=973796d633d8e1597f07098a80515630a238c4ccf6d94c48d870ec92379cf0b9&showpw=0&httoken=2022817050";
        const request = "e32111821872de340369fbc443194e5e5ab95be011ec2af2429e438db2305c8ec0419432e5abc80a6e4d1f9aa2c2f17edc3c2eed5c4c196320dd7f68d5534fba34a7273739ad4c4cdb90d71cb5479cf7ba89b08d54606a4746a09d1d47a913a0b5f8ef609816f8fbf0a24dca1e3dba56a73bdd2fa0";

        const hash = "973796d633d8e1597f07098a80515630a238c4ccf6d94c48d870ec92379cf0b9";
        const httoken = "2022817050";
        const challenge = "AF22090AA85785D29936E4FA641075E8789C0DC8D4054708E241152897B94D35";

        mock.onPost("http://host/data/Login.json", request).reply(200, response, []);

        sp.challenge = challenge;
        return sp.sendLogin(hash, httoken);
    });

    it(`should load and parse INetIP.json`, async () => {
        const sp = new Smart3("http://speedport.ip", "dummy");
        prepareMock("INetIP");
        sp.challenge = "1B5C71895AFD6A58F0C16C20E1E359801E4747322FC45206190C46A70E9FFB88";

        const data = await sp.getINetIP();

        expect(data).that.contains.something.like({id: "WAN.ipv4_address", value: "84.140.164.244"});
        expect(data).that.contains.something.like({id: "WAN.ipv4_gateway", value: "62.155.243.145"});
        expect(data).that.contains.something.like({id: "WAN.ipv4_dns_pri", value: "217.0.43.177"});
        expect(data).that.contains.something.like({id: "WAN.ipv4_dns_sec", value: "217.0.43.161"});
        expect(data).that.contains.something.like({id: "WAN.ipv6_address", value: "2003:cd:3fff:2017:66cc:22ff:fe39:a19c"});
        expect(data).that.contains.something.like({id: "WAN.ipv6_gateway", value: "fe80::86b5:9cff:fef9:baad"});
        expect(data).that.contains.something.like({id: "WAN.ipv6_dns_pri", value: "2003:180:2:9000::1:0:53"});
        expect(data).that.contains.something.like({id: "WAN.ipv6_dns_sec", value: "2003:180:2:7000::1:0:53"});
        expect(data).that.contains.something.like({id: "DSL.link_status", value: "online"});
        expect(data).that.contains.something.like({id: "WAN.status", value: "online"});
        expect(data).that.contains.something.like({id: "WAN.uptime", value: 1002845});
        expect(data).that.contains.something.like({id: "DSL.dualstack", value: 1});
    });

    it(`should load and parse LAN.json`, async () => {
        const sp = new Smart3("http://speedport.ip", "dummy");
        prepareMock("LAN");
        sp.challenge = "1B5C71895AFD6A58F0C16C20E1E359801E4747322FC45206190C46A70E9FFB88";

        return await sp.getLAN();
    });

    it(`should load and parse SystemMessages.json`, async () => {
        const sp = new Smart3("http://speedport.ip", "dummy");
        prepareMock("SystemMessages");
        sp.challenge = "1B5C71895AFD6A58F0C16C20E1E359801E4747322FC45206190C46A70E9FFB88";

        const data = await sp.getSystemMessages();

        expect(data).that.contains.something.like({id: "info.firmware", value: "010137.4.8.000.0"});
        expect(data).that.contains.something.like({id: "info.bootcode", value: "1.30.002.0000"});
        expect(data).that.contains.something.like({id: "DSL.modem_version", value: "8.C.3.2.1.7_8.C.1.C.1.2"});
        expect(data).that.contains.something.like({id: "DSL.downstream", value: 63671});
        expect(data).that.contains.something.like({id: "DSL.upstream", value: 12736});

    });

    it(`should create get params`, async () => {
        const sp = new Smart3("http://speedport.ip", "dummy");

        const data = sp.getParams(1337);
        expect(data.params).to.have.own.property("_time");
        expect(data.params._lang).to.be.equal("DE");
        expect(data.params._tn).to.be.equal(1337);
    });

    function prepareMock(page) {
        const data = fs.readFileSync(__dirname + "/smart3/" + page + ".enc.json", "utf-8");
        mock.onGet("http://speedport.ip/data/" + page + ".json").reply(200, data, []);
    }
});


describe("W925V", () => {

    it(`getHttoken() should return httoken`, () => {
        const expected = "1143855916";
        const data = fs.readFileSync(__dirname + "/w925v/index.html", "utf-8");
        mock.onGet("http://host").reply(200, data, []);

        return sputils.getHttoken(axios.create(), "http://host")
            .then(token => expect(token).to.be.equal(expected));
    });

    it(`getChallenge() should return challenge`, () => {
        const sp = new W925V("http://host", "dummy");
        const expected = "2BD97A8473D3D530005629DB7ADFDE2E93BF7DC963E181F89AB5B9148B81BBB6";
        const response = JSON.parse("[{\"vartype\":\"status\",\"varid\":\"status\",\"varvalue\":\"ok\"},{\"vartype\":\"value\",\"varid\":\"challenge\",\"varvalue\":\"2BD97A8473D3D530005629DB7ADFDE2E93BF7DC963E181F89AB5B9148B81BBB6\"}]\n");
        mock.onPost("http://host/data/Login.json", qs.stringify({
            "getChallenge": "1",
            "httoken": 1234
        })).reply(200, response, []);
        return sp.getChallenge(1234)
            .then(challenge => expect(challenge).to.be.equal(expected));
    });

    it(`sendLogin() should return successful`, () => {
        const sp = new W925V("http://host", "dummy");
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

    it(`hashPassword() should return hash`, () => {
        const expected = "1ab34f298379c8f319c127769db84092826ffa834cffb3fd0261e82ed09ccb7f";
        const challenge = "cool-water";

        const hash = sputils.hashPassword(challenge, "totallySecure!");
        expect(hash).to.be.equal(expected);
    });
});


describe("EngineerMenu", () => {

    it(`getInterfaceLan() should return non null values`, async () => {
        const em = new EngineerMenu(axios.create(), "http://host");
        prepareMock("interfaces_hidden_lan.stm");
        return em.getInterfaceLan()
            .then(metrics => assertMetricsNotNull(metrics));
    });

    it(`getInterfacesWan() should return non null values`, () => {
        const em = new EngineerMenu(axios.create(), "http://host");
        mock.reset();
        prepareMock("interfaces_hidden_wan.stm");
        return em.getInterfaceWan()
            .then(metrics => assertMetricsNotNull(metrics));
    });

    it(`getDsl() should return non null values`, () => {
        const em = new EngineerMenu(axios.create(), "http://host");
        mock.reset();
        prepareMock("dsl_hidden_status.stm");
        return em.getDsl()
            .then(metrics => assertMetricsNotNull(metrics));
    });

    it(`getMemCpuUtilization() should return non null values`, () => {
        const em = new EngineerMenu(axios.create(), "http://host");
        prepareMock("mem_cpu_utilization.stm");
        return em.getMemCpuUtilization()
            .then(metrics => assertMetricsNotNull(metrics));
    });

    it(`getModuleVersions() should return non null values`, () => {
        const em = new EngineerMenu(axios.create(), "http://host");
        prepareMock("module_versions.stm");
        return em.getModuleVersions()
            .then(metrics => assertMetricsNotNull(metrics));
    });

    function assertMetricsNotNull(metrics) {
        for (const metric of metrics) {
            if (metric.value == null) {
                console.log(metric.id);
            }
            console.log(metrics);
            expect(metric.value).is.not.null;
        }
    }

    function prepareMock(page) {
        const data = fs.readFileSync(__dirname + "/engineer_menu/" + page, "utf-8");
        mock.onGet("http://host/engineer/html/" + page).reply(200, data, []);
    }
});
