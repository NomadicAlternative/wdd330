import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get the current cart from localStorage, or initialize as empty array
  let cart = getLocalStorage("so-cart") || [];

  // Add the new product to the cart array
  cart.push(product);

  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cart);

  alert("Product added to cart!");
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
