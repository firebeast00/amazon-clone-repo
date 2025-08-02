import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { currencyFormat } from "./utils/money.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

let cartOrderSummary = "";
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingItem;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingItem = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();

  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const dateString = deliveryDate.format("dddd, MMMM D");
  cartOrderSummary += `
            <div class="cart-item-container js-cart-item-container-${
              matchingItem.id
            }">
            <div class="delivery-date">Delivery date: ${dateString} </div>

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
                    matchingItem.id
                  }"> ${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id ="${
                    matchingItem.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input">
                  <span class="save-quantity-link link-primary js-save-quantity-link">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${
                    cartItem.productId
                  }">
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
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd MMMM D");
    const priceString =
      deliveryOption.priceCents === 0
        ? `FREE`
        : `$${currencyFormat(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
                    <div class="delivery-option">
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
function updateCartQuantity() {
  let cartQuantity = calculateCartQuantity();
  document.querySelector(
    ".js-header-cart-quantity"
  ).innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();

const button = document.querySelectorAll(".js-delete-quantity-link");
button.forEach((link) => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
    updateCartQuantity();
  });
});

const updateButton = document.querySelectorAll(".js-update-quantity-link");

updateButton.forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");

    const saveLink = document.querySelectorAll(".js-save-quantity-link");
    saveLink.forEach((link) => {
      link.addEventListener("click", () => {
        saveUpdateQuantity(productId);

        container.classList.remove("is-editing-quantity");
      });
    });
  });
});
function saveUpdateQuantity(productId) {
  const inputElement = document.querySelectorAll(".js-quantity-input");
  inputElement.forEach((input) => {
    const newQuantity = Number(input.value);
    if (newQuantity >= 0 && newQuantity < 1000) {
      updateQuantity(productId, newQuantity);
    } else {
      alert("updated Quantity should be greate 0 and less than 1000");
    }

    document.querySelector(`.js-quantity-label-${productId}`).innerHTML =
      newQuantity;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveUpdateQuantity();
      }
      console.log(e.key);
    });
    updateCartQuantity();
  });
}
