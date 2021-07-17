"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CheckRegex_1 = require("./CheckRegex");
let checkRegex = new CheckRegex_1.CheckRegex();
// test for email
test("erwarten dass email valide ist", () => {
    expect(checkRegex.email("vali.vogt@live.de")).toBe(true);
});
test("erwarten dass email nicht valide ist", () => {
    expect(checkRegex.email("vali.vogt(at)live.de")).toBe(false);
});
// test for date
test("erwarten dass datum valide ist", () => {
    expect(checkRegex.date("1998-12-12")).toBe(true);
});
test("erwarten dass datum nicht valide ist", () => {
    expect(checkRegex.date("1998-15-33")).toBe(false);
});
// test for period
test("erwarten dass periode valide ist", () => {
    expect(checkRegex.timeAndPeriod("12:00-15:00", true)).toBe(true);
});
test("erwarten dass periode valide ist", () => {
    expect(checkRegex.timeAndPeriod("32:00-28:00", true)).toBe(false);
});
//# sourceMappingURL=Unit.test.js.map