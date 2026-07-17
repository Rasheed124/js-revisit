import { updateCartQuanity } from "../data/cart.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

const url = new URL(window.location.href);
const orderId = url.searchParams.get("orderId");
const productId = url.searchParams.get("productId");

const orderedProduct = JSON.parse(localStorage.getItem("order")) || [];

function renderTrackingPage() {
  if (orderedProduct.id !== orderId) {
    return `<p>Order data mismatch or tracking record missing.</p>`;
  }

  const matchingOrderItem = orderedProduct.products.find(
    (item) => item.productId === productId,
  );

  const matchingProduct = getProduct(productId);

  if (!matchingOrderItem || !matchingProduct) {
    return `<p>Error retrieving specific package information.</p>`;
  }

  return `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${formatCurrency(matchingOrderItem.estimatedDeliveryTime)}
    </div>

    <div class="product-info">
      ${matchingProduct.name}
    </div>

    <div class="product-info">
      Quantity: ${matchingOrderItem.quantity}
    </div>

    <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}" />

    <div class="progress-labels-container">
      <div class="progress-label current-status">Preparing</div>
      <div class="progress-label">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: 10%;"></div>
    </div>
  `;
}

function render() {
  const trackingElement = document.querySelector(".js-order-tracking");
  if (trackingElement) {
    trackingElement.innerHTML = renderTrackingPage();
  } else {
    console.error("Target placeholder element .js-order-tracking not located.");
  }
}

loadProductsFetch().then(() => {
  render();
  updateCartQuanity();
});
