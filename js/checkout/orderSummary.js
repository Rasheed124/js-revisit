import {
  cart,
  updateCartQuanity,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity,
} from "../../data/cart.js";

import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { checkEmptyCart } from "../checkout.js";

export function renderOrderSummary() {
  let cartSummaryHtml = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchedProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("ddd , MMM D");

    cartSummaryHtml += `
     <div class="cart-item-container-${matchedProduct.id} js-cart-item-container">
            <div class="delivery-date">Delivery date: ${dateString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchedProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchedProduct.name}
                </div>
                <div class="product-price">${matchedProduct.getPrice()}</div>
                <div class="product-quantity">
                  <span> 
                    Quantity: <span class="quantity-label js-quantity-label-${matchedProduct.id}">${cartItem.quantity}</span> 
                  </span>
                  
                  <!-- 2. Added the editing input markup -->
                  <input type="number" min="1" max="99" class="quantity-input js-quantity-input-${matchedProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchedProduct.id}">Save</span>
                  
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchedProduct.id}">
                    Update
                  </span>
                  <span data-product-Cart-id="${matchedProduct.id}" class="delete-quantity-link link-primary">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
                ${deliveryOptionHtml(matchedProduct, cartItem)}
                
              </div>
            </div>
          </div>
  `;
  });

  function deliveryOptionHtml(matchedProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("ddd , MMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
                <div class="delivery-option js-delivery-option" data-delivery-option-id = "${deliveryOption.id}" data-product-id = "${matchedProduct.id}">
                  <input
                    type="radio"
                    ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchedProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString}</div>
                  </div>
              </div>
    `;
    });

    return html;
  }

  document.querySelector(".order-summary-detailsjs").innerHTML =
    cartSummaryHtml;

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.cart-item-container-${productId}`,
      );

      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.cart-item-container-${productId}`,
      );

      const inputElement = document.querySelector(
        `.js-quantity-input-${productId}`,
      );
      const newQuantity = Number(inputElement.value);

      if (newQuantity <= 0 || newQuantity >= 100) {
        alert("Quantity must be at least 1 and less than 100");
        return;
      }

      updateQuantity(productId, newQuantity);

      container.classList.remove("is-editing-quantity");

      renderOrderSummary();
      updateCartQuanity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".delete-quantity-link").forEach((deletBtn) => {
    deletBtn.addEventListener("click", () => {
      const productCartID = deletBtn.dataset.productCartId;
      removeFromCart(productCartID);
      checkEmptyCart();
      updateCartQuanity();
      renderPaymentSummary();

      const container = document.querySelector(
        `.cart-item-container-${productCartID}`,
      );
      container.remove();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
