import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer templates
loadHeaderFooter();

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
  
  // Add event listeners to remove buttons
  addRemoveButtonListeners();
}

function addRemoveButtonListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function removeFromCart(event) {
  const productId = event.currentTarget.dataset.id;
  
  // Get current cart
  let cart = getLocalStorage("so-cart") || [];
  
  // Find the index of the first item with this ID
  const itemIndex = cart.findIndex((item) => item.Id === productId);
  
  if (itemIndex !== -1) {
    // Remove the item from the cart
    cart.splice(itemIndex, 1);
    
    // Save updated cart
    setLocalStorage("so-cart", cart);
    
    // Re-render the cart
    renderCartContents();
  }
}

function cartItemTemplate(item) {
  // Safely access all properties with fallbacks
  const colorName =
    item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : "N/A";
  
  // Use the new API image structure (Images.PrimaryMedium)
  const imagePath = item.Images?.PrimaryMedium || item.Image || "/images/noun_Tent_2517.svg";
  
  const productName = item.Name || "Unknown Product";
  const price = item.FinalPrice || item.ListPrice || "0.00";
  const productId = item.Id || "";

  const newItem = `<li class="cart-card divider" data-id="${productId}">
  <a href="/product_pages/?product=${productId}" class="cart-card__image">
    <img
      src="${imagePath}"
      alt="${productName}"
    />
  </a>
  <a href="/product_pages/?product=${productId}">
    <h2 class="card__name">${productName}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price}</p>
  <button class="cart-card__remove" data-id="${productId}" aria-label="Remove ${productName} from cart">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  </button>
</li>`;

  return newItem;
}

renderCartContents();
