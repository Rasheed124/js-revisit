import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/backend.js";
import "../data/cart-class.js";
import { products, loadProductsFetch } from "../data/products.js";

loadProductsFetch().then(() => {
  (renderOrderSummary(), renderPaymentSummary());
});
