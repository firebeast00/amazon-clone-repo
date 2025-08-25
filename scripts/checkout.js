/* import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";

async function loadPage() {
  await loadProductsFetch();
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
 */

import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";

let initialized = false;

async function safeLoadProductsFetch({ retries = 1 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await loadProductsFetch();
    } catch (err) {
      lastErr = err;
      // brief backoff before retrying
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }
  throw lastErr;
}

function showStatus(message, { type = "info" } = {}) {
  // Lightweight global status banner (non-intrusive, only if not present)
  let el = document.querySelector(".js-global-status");
  if (!el) {
    el = document.createElement("div");
    el.className = "js-global-status";
    Object.assign(el.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      padding: "10px 14px",
      font: "14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial",
      zIndex: 9999,
      color: type === "error" ? "#8b1a1a" : "#0b3d2e",
      background: type === "error" ? "#ffecec" : "#e6fff5",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      textAlign: "center",
    });
    document.body.appendChild(el);
  }
  el.textContent = message;
  return el;
}

function clearStatus() {
  const el = document.querySelector(".js-global-status");
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function showLoadingPlaceholders() {
  // If your checkout sections have containers, you can hint loading text.
  const orderEl = document.querySelector(".js-order-summary");
  const payEl = document.querySelector(".js-payment-summary");
  if (orderEl && !orderEl.childElementCount)
    orderEl.textContent = "Loading order summary…";
  if (payEl && !payEl.childElementCount)
    payEl.textContent = "Loading payment summary…";
}

function clearLoadingPlaceholders() {
  const orderEl = document.querySelector(".js-order-summary");
  const payEl = document.querySelector(".js-payment-summary");
  if (orderEl && orderEl.textContent === "Loading order summary…")
    orderEl.textContent = "";
  if (payEl && payEl.textContent === "Loading payment summary…")
    payEl.textContent = "";
}

export default async function initCheckoutPage() {
  if (initialized) return;
  initialized = true;

  // Minimal loading UX
  showStatus("Loading products…");
  showLoadingPlaceholders();

  try {
    await safeLoadProductsFetch({ retries: 1 });

    // Defer rendering to next microtask for smoother paint
    await Promise.resolve();

    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();

    clearLoadingPlaceholders();
    clearStatus();
  } catch (err) {
    clearLoadingPlaceholders();
    showStatus("Couldn’t load products. Please refresh or try again.", {
      type: "error",
    });
    // Optional: surface error to console for debugging
    console.error("[checkout] loadProductsFetch failed:", err);
  }
}

// Auto-run (keeps same behavior as your original file)
initCheckoutPage();
