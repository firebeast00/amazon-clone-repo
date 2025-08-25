import { getOrder } from "../../data/orders.js";
import { getProduct, loadProductsFetch } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
export async function loadPage() {
  await loadProductsFetch();
  const url = new URL(window.location.href);
  const productId = url.searchParams.get("productId");
  const orderId = url.searchParams.get("orderId");
  const product = getProduct(productId);
  const orders = getOrder(orderId);
  let productDetails;
  console.log(orders);
  orders.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });
  const today = dayjs();
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const orderTime = dayjs(orders.orderTime);
  const progress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  const deliverdMessage = today < deliveryTime ? "Arriving on" : "Delivered on";

  const trackingHTML = `<div class="delivery-date">
          ${deliverdMessage} ${dayjs(
    productDetails.estimatedDeliveryTime
  ).format("dddd, MMMM D")}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            ${progress <= 50 ? "Preparing" : ""}
          </div>
          <div class="progress-label current-status">
            ${progress >= 50 && progress <= 100 ? "Shipped" : ""}
          </div>
          <div class="progress-label">
            ${progress >= 100 ? "Deliverd" : ""}
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progress}%;"></div>
        </div>`;
  document.querySelector(".js-order-tracking").innerHTML = trackingHTML;
}
