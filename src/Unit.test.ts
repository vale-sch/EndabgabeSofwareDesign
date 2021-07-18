import CheckRegex from "./CheckRegex";


// test for email
test("erwarten dass email valide ist", () => {
    expect(CheckRegex.email("vali.vogt@live.de")).toBe(true);
});
test("erwarten dass email nicht valide ist", () => {
    expect(CheckRegex.email("vali.vogt(at)live.de")).toBe(false);
});

// test for date
test("erwarten dass datum valide ist", () => {
    expect(CheckRegex.date("1998-12-12")).toBe(true);
});
test("erwarten dass datum nicht valide ist", () => {
    expect(CheckRegex.date("1998-15-33")).toBe(false);
});

// test for period
test("erwarten dass periode valide ist", () => {
    expect(CheckRegex.timeAndPeriod("12:00-15:00", true)).toBe(true);
});
test("erwarten dass periode valide ist", () => {
    expect(CheckRegex.timeAndPeriod("32:00-28:00", true)).toBe(false);
});