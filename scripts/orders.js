import { orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { currencyFormat } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
async function loadPage() {
  await loadProductsFetch();
  let ordersHTML = "";
  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format("MMMM, D");

    ordersHTML += `   <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${currencyFormat(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${productsListHTML(order)}
          </div>
        </div>`;
  });

  function productsListHTML(order) {
    let productListHTML = "";
    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      const deliveryTimeString = dayjs(
        productDetails.estimatedDeliveryTime
      ).format("MMMM, D");

      productListHTML += `<div class="product-image-container">
              <img src="${product.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${deliveryTimeString}
              </div>
              <div class="product-quantity">
                Quantity: ${productDetails.quantity}
              </div>
              <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${productDetails.productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a class="js-track-link" href="tracking.html?orderId=${order.id}&productId=${productDetails.productId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>`;
    });
    return productListHTML;
  }
  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;
  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      console.log(productId);
      addToCart(productId, 1);
      button.innerHTML = "Added";
      setTimeout(() => {
        button.innerHTML = `    
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>`;
      }, 1500);
    });
  });
}
loadPage();
