import { products } from "../../data/products.js";
import { addToCart, calculateCartQuantity } from "../../data/cart.js";
import { currencyFormat } from "../utils/money.js";

export default function renderProductsGrid() {
  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");

  // Default to showing all products
  let filteredProducts = products;
  if (search) {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  let productHTML = "";
  filteredProducts.forEach((product) => {
    productHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${currencyFormat(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            ${Array.from(
              { length: 10 },
              (_, i) =>
                `<option value="${i + 1}" ${i === 0 ? "selected" : ""}>${
                  i + 1
                }</option>`
            ).join("")}
          </select>
        </div>
        
        ${product.extraInfoHTML()}
        
        <div class="product-spacer"></div>
        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>
        <button class="add-to-cart-button button-primary js-add-to-cart-button" 
                data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector(".js-products-grid").innerHTML = productHTML;

  function updateCartQuantity() {
    document.querySelector(".js-cart-quantity").innerHTML =
      calculateCartQuantity();
  }
  updateCartQuantity();

  let addedMessageTimeouts = {};

  document.querySelectorAll(".js-add-to-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const quantity = Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value
      );

      addToCart(productId, quantity);
      updateCartQuantity();

      const messageElement = document.querySelector(
        `.js-added-to-cart-${productId}`
      );
      messageElement.classList.add("added-to-cart-visible");

      if (addedMessageTimeouts[productId]) {
        clearTimeout(addedMessageTimeouts[productId]);
      }
      addedMessageTimeouts[productId] = setTimeout(() => {
        messageElement.classList.remove("added-to-cart-visible");
      }, 2000);
    });
  });

  // Search button
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar").value;
    window.location.href = `amazon.html?search=${search}`;
  });

  // Enter key on search bar
  document.querySelector(".js-search-bar").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const search = e.target.value;
      window.location.href = `amazon.html?search=${search}`;
    }
  });
}
