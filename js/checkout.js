import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/backend.js";
import "../data/cart-class.js";
import { products, loadProductsFetch } from "../data/products.js";
import { updateCartQuanity } from "../data/cart.js";





async function loadCartPage() {
  try {
    await loadProductsFetch();

    renderOrderSummary();
    renderPaymentSummary();

    updateCartQuanity()
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

loadCartPage();
