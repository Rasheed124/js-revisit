import { formatCurrency } from "../../js/utils/money.js";

describe("test suite: formatCurrency", () => {
  it("Converts cents to dollars", () => {
    expect(formatCurrency(2095)).toEqual("20.95");
  });


  it("Works with with 0", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });
});
