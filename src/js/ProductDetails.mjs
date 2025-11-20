import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product
    // findProductById will return a promise! use await to process it
    this.product = await this.dataSource.findProductById(this.productId);
    
    // once we have the product details, render the HTML
    this.renderProductDetails();
    
    // add listener to Add to Cart button
    // Notice the .bind(this). This callback will not work if bind(this) is missing
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    // Get the current cart from localStorage
    let cart = getLocalStorage("so-cart");
    
    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      cart = [];
    }
    
    // Add the new product to the cart array
    cart.push(this.product);
    
    // Save the updated cart back to localStorage
    setLocalStorage("so-cart", cart);
    
    // Create a success alert div
    const alert = document.createElement("div");
    alert.classList.add("alert", "success");
    alert.innerHTML = `<p>✓ ${this.product.NameWithoutBrand || this.product.Name} has been added to your cart!</p><span class="close-alert">X</span>`;
    
    // Add the alert to the top of main
    const main = document.querySelector("main");
    main.prepend(alert);
    
    // Scroll to top to show the alert
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add click listener to close button
    alert.querySelector(".close-alert").addEventListener("click", function() {
      main.removeChild(alert);
    });
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      if (alert.parentElement) {
        main.removeChild(alert);
      }
    }, 5000);
  }

  renderProductDetails() {
    const productSection = document.querySelector(".product-detail");
    
    // Safely access all properties with fallbacks
    const brandName = this.product.Brand ? this.product.Brand.Name : "";
    const productName = this.product.NameWithoutBrand || this.product.Name || "Unknown Product";
    // Use PrimaryLarge for product detail images
    const imagePath = this.product.Images?.PrimaryLarge || this.product.Image || "/images/noun_Tent_2517.svg";
    const finalPrice = this.product.FinalPrice || this.product.ListPrice || "0.00";
    const suggestedPrice = this.product.SuggestedRetailPrice || "";
    const colorName = this.product.Colors && this.product.Colors.length > 0 
      ? this.product.Colors[0].ColorName 
      : "";
    const description = this.product.DescriptionHtmlSimple || "";
    const productId = this.product.Id || "";
    
    // Calculate discount if applicable
    let discountHTML = "";
    if (suggestedPrice && suggestedPrice > finalPrice) {
      const discount = ((suggestedPrice - finalPrice) / suggestedPrice * 100).toFixed(0);
      discountHTML = `<p class="product-card__discount">${discount}% off MSRP</p>`;
    }

    productSection.innerHTML = `
      <h3>${brandName}</h3>
      <h2 class="divider">${productName}</h2>
      <img
        class="divider"
        src="${imagePath}"
        alt="${productName}"
      />
      <p class="product-card__price">$${finalPrice}</p>
      ${discountHTML}
      <p class="product__color">${colorName}</p>
      <p class="product__description">
        ${description}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${productId}">Add to Cart</button>
      </div>
    `;
  }
}
