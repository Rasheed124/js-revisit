import { updateCartQuanity } from "../data/cart.js";
import { getProduct, loadProductsFetch, products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";



let orderedProduct = JSON.parse(localStorage.getItem("order")) || [];

export function orderCart(order) {
  orderedProduct = order;
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("order", JSON.stringify(orderedProduct));
}

function formatDate(dateString) {
  const options = { month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function renderOrderGrid() {
  if (!orderedProduct || !orderedProduct.products) {
    return `<p>No orders found.</p>`;
  }

  let itemsHtml = "";

  orderedProduct.products.forEach((orderItem) => {
    const matchingProduct = getProduct(orderItem.productId);

    if (!matchingProduct) return;

    itemsHtml += `
      <div class="product-image-container">
        <img src="${matchingProduct.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${formatDate(orderItem.estimatedDeliveryTime)}
        </div>
        <div class="product-quantity">
          Quantity: ${orderItem.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${orderedProduct.id}&productId=${matchingProduct.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  return `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formatDate(orderedProduct.orderTime)}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(orderedProduct.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${orderedProduct.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${itemsHtml}
      </div>
    </div>
  `;
}

function render() {
  document.querySelector(".js-order-grid").innerHTML = renderOrderGrid();
}

loadProductsFetch().then(() => {
  render();
    updateCartQuanity();
  
});
