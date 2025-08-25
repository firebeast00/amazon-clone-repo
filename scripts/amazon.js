import { loadProductsFetch } from "../data/products.js";
import renderProductsGrid from "./amazon/amazonProductsList.js";
async function loadPage() {
  await loadProductsFetch();
  renderProductsGrid();
}
loadPage();
