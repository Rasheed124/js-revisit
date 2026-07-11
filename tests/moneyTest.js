import { formatCurrency } from "../js/utils/money.js";

console.log("It round up to nearest number");

if (formatCurrency(2095) === "20.95") {
  console.log("passed");
} else {
  console.log("failed");
}
