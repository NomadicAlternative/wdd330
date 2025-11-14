import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // Check if cart has items
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // Safely access all properties with fallbacks
  const colorName =
    item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : "N/A";
  const imagePath = item.Image
    ? item.Image.replace("../", "/")
    : "/images/noun_Tent_2517.svg";
  const productName = item.Name || "Unknown Product";
  const price = item.FinalPrice || item.ListPrice || "0.00";

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imagePath}"
      alt="${productName}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${productName}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price}</p>
</li>`;

  return newItem;
}

renderCartContents();
