import { calculateCartQuantity } from "../../data/cart.js";

export function renderTrackingHeader() {
  const cartQuantity = calculateCartQuantity();
  const trackingHeaderHTML = ` <div class="amazon-header-left-section">
        <a href="amazon.html" class="header-link">
          <img class="amazon-logo" src="images/amazon-logo-white.png" />
          <img
            class="amazon-mobile-logo"
            src="images/amazon-mobile-logo-white.png"
          />
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input class="search-bar js-search-bar" type="text" placeholder="Search" />

        <button class="search-button js-search-button" >
        <a class="search-link" href=""></a>
          <img class="search-icon" src="images/icons/search-icon.png" />
        </button>
      </div>

      <div class="amazon-header-right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png" />
          <div class="cart-quantity">${cartQuantity}</div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
      `;

  document.querySelector(".js-amazon-header").innerHTML = trackingHeaderHTML;
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const inputElement = document.querySelector(".js-search-bar");
    const searchText = inputElement.value;
    window.location.href = `amazon.html?search=${searchText}`;
  });
}
renderTrackingHeader();
