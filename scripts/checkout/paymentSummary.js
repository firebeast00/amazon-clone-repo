import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { currencyFormat } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let ProductPriceCents = 0;
  let ShippingPrice = 0;
  let cartItemQuantity = 0;
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    ProductPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    ShippingPrice += deliveryOption.priceCents;
    cartItemQuantity += cartItem.quantity;
  });
  const totalBeforeTax = ProductPriceCents + ShippingPrice;
  const totalTax = totalBeforeTax * 0.1;
  const totalCents = totalBeforeTax + totalTax;

  const paymentSummaryHTML = `      <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${cartItemQuantity}):</div>
            <div class="payment-summary-money">$${currencyFormat(
              ProductPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${currencyFormat(
              ShippingPrice
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${currencyFormat(
              totalBeforeTax
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${currencyFormat(
              totalTax
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${currencyFormat(
              totalCents
            )}</div>
          </div>

          <button class="place-order-button button-primary js-place-order-button">
            Place your order
          </button>`;
  document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;
  document
    .querySelector(".js-place-order-button")
    .addEventListener("click", async () => {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });
      const order = await response.json();
      addOrder(order);

      window.location.href = "orders.html";
    });
}
