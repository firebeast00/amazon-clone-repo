import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { currencyFormat } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function renderOrderSummary() {
  let cartOrderSummary = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingItem = getProduct(productId);
    console.log(matchingItem);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);
    cartOrderSummary += `
            <div class="cart-item-container js-cart-item-container-${
              matchingItem.id
            }">
            <div class="delivery-date">Delivery date:${dateString} </div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingItem.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingItem.name}
                </div>
                <div class="product-price">$${currencyFormat(
                  matchingItem.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label-${
                    cartItem.productId
                  }"> ${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id ="${productId}">
                    Update
                  </span>
                  <input type="number" class="quantity-input js-quantity-input-${productId}" value="${
      cartItem.quantity
    }" min="1">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${productId}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${productId}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                  ${deliveryOptionsHTML(matchingItem, cartItem)}
               
              </div>
            </div>
          </div>
  `;
  });
  document.querySelector(".js-order-summary").innerHTML = cartOrderSummary;
  function deliveryOptionsHTML(matchingItem, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? `FREE`
          : `$${currencyFormat(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
                    <div class="delivery-option js-delivery-option" data-product-id="${
                      matchingItem.id
                    }" data-delivery-option-id="${deliveryOption.id}">
                  <input
                    type="radio"
                    ${isChecked ? `checked` : ``}
                    class="delivery-option-input"
                    name="${matchingItem.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} Shipping</div>
                  </div>
                </div>
    
    `;
    });
    return html;
  }

  const button = document.querySelectorAll(".js-delete-quantity-link");
  button.forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      removeFromCart(productId);
      renderPaymentSummary();
      renderOrderSummary();
      renderCheckoutHeader();
    });
  });

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      saveUpdateQuantity(productId);
      container.classList.remove("is-editing-quantity");
    });
  });
  function saveUpdateQuantity(productId) {
    const inputEl = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(inputEl.value);
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else if (newQuantity >= 1 && newQuantity < 1000) {
      updateQuantity(productId, newQuantity);
    } else {
      alert("updated Quantity should be greater than 0 and less than 1000");
    }
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
  }
  document
    .querySelectorAll("[class^='js-quantity-input-']")
    .forEach((inputEl) => {
      inputEl.addEventListener("keydown", () => {
        console.log("input element is clicked inside.");
      });
    });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderPaymentSummary();
      renderOrderSummary();
    });
  });
}
function isWeekend(date) {
  const dayOfWeek = date.format("dddd");
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}
function calculateDeliveryDate(deliveryOption) {
  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, "day");
    if (!isWeekend(deliveryDate)) {
      remainingDays--;
      // This is a shortcut for:
      // remainingDays = remainingDays - 1;
    }
  }

  const dateString = deliveryDate.format("dddd, MMMM D");
  return dateString;
}
