import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
  let productPriceCent = 0;
  let shippingPriceCent = 0;
  let itemCount = 0

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCent += product.priceCents * cartItem.quantity;
    itemCount +=  cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCent += deliveryOption.priceCents;
  });

  const totalBeforCents = productPriceCent + shippingPriceCent;
  const taxCents = totalBeforCents * 0.1;

  const totalCents = totalBeforCents + taxCents;

  let paymentSummaryHtml = `
      <div class="payment-summary-title">Order Summary</div>
          <div class="payment-summary-row">
            <div>Items (${itemCount}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCent)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCent)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${totalCents}</div>
          </div>

           <button class="place-order-button button-primary">
            Place your order
          </button>
  
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml;

  console.log(totalBeforCents, taxCents, totalCents);
}
