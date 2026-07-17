import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/backend.js";
import "../data/cart-class.js";
import { products, loadProductsFetch } from "../data/products.js";
import { cart, updateCartQuanity } from "../data/cart.js";

export function checkEmptyCart() {
  if (cart.length === 0) {
    const gridElement = document.querySelector(".checkout-grid");
    if (gridElement) {
      gridElement.innerHTML = `
        <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
          <p style="font-size: 18px; font-weight: 500; margin-bottom: 20px;">No order found</p>
          <a href="amazon.html" class="button-primary" style="padding: 10px 20px; text-decoration: none;">
            View products
          </a>
        </div>
      `;
    }
    updateCartQuanity();
    return true;
  }
  return false;
}

async function loadCartPage() {
  try {
    await loadProductsFetch();

    if (checkEmptyCart()) {
      return;
    }

    renderOrderSummary();
    renderPaymentSummary();
    updateCartQuanity();
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

loadCartPage();
