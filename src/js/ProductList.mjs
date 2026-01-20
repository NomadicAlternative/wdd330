import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Use PrimaryMedium for product listing images
  const imagePath = product.Images?.PrimaryMedium || product.Image || "/images/noun_Tent_2517.svg";
  const brandName = product.Brand ? product.Brand.Name : "";
  const productName = product.NameWithoutBrand || product.Name || "Unknown Product";
  const finalPrice = product.FinalPrice || product.ListPrice || "0.00";
  const productId = product.Id || "";

  return `<li class="product-card">
    <a href="../product_pages/?product=${productId}">
      <img
        src="${imagePath}"
        alt="${productName}"
      />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">$${finalPrice}</p>
    </a>
    <button class="quick-view-btn" data-product-id="${productId}">Quick View</button>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
    this.filteredProducts = [];
  }

  async init() {
    // Get the list of products from the data source
    const list = await this.dataSource.getData(this.category);
    this.products = list;
    this.filteredProducts = list;
    
    // Update the page title with category
    this.updateTitle();
    
    // Render the list
    this.renderList(this.products);
    
    // Initialize search functionality
    this.initSearch();
  }

  updateTitle() {
    const titleElement = document.querySelector(".products h2");
    if (titleElement && this.category) {
      // Capitalize first letter of each word in category
      const formattedCategory = this.category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      titleElement.textContent = `Top Products: ${formattedCategory}`;
    }
  }

  renderList(list, clear = true) {
    // Use the reusable renderListWithTemplate function
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", clear);
  }

  initSearch() {
    const searchInput = document.getElementById("productSearch");
    const clearButton = document.getElementById("clearSearch");
    const searchResults = document.getElementById("searchResults");
    const noResults = document.getElementById("noResults");

    if (!searchInput) return;

    // Search input event listener
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.trim().toLowerCase();
      
      // Show/hide clear button
      if (searchTerm) {
        clearButton.classList.add("active");
      } else {
        clearButton.classList.remove("active");
      }

      this.filterProducts(searchTerm, searchResults, noResults);
    });

    // Clear button event listener
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        searchInput.value = "";
        clearButton.classList.remove("active");
        this.filterProducts("", searchResults, noResults);
        searchInput.focus();
      });
    }
  }

  filterProducts(searchTerm, searchResults, noResults) {
    // Add filtering class for animation
    this.listElement.classList.add("filtering");

    setTimeout(() => {
      if (!searchTerm) {
        // Show all products
        this.filteredProducts = this.products;
        this.listElement.innerHTML = "";
        this.renderList(this.filteredProducts, false);
        searchResults.classList.remove("active");
        noResults.style.display = "none";
        this.listElement.classList.remove("filtering");
        return;
      }

      // Filter products based on search term
      this.filteredProducts = this.products.filter((product) => {
        const name = (product.Name || "").toLowerCase();
        const brand = product.Brand ? (product.Brand.Name || "").toLowerCase() : "";
        const description = (product.DescriptionHtmlSimple || "").toLowerCase();
        const color = product.Colors && product.Colors.length > 0 
          ? (product.Colors[0].ColorName || "").toLowerCase() 
          : "";

        return (
          name.includes(searchTerm) ||
          brand.includes(searchTerm) ||
          description.includes(searchTerm) ||
          color.includes(searchTerm)
        );
      });

      // Clear and render filtered products
      this.listElement.innerHTML = "";
      
      if (this.filteredProducts.length === 0) {
        // Show no results message
        noResults.style.display = "block";
        searchResults.classList.remove("active");
      } else {
        // Show filtered products
        this.renderList(this.filteredProducts, false);
        noResults.style.display = "none";
        
        // Show results count
        searchResults.textContent = `Found ${this.filteredProducts.length} product${this.filteredProducts.length !== 1 ? "s" : ""} matching "${searchTerm}"`;
        searchResults.classList.add("active");
      }

      this.listElement.classList.remove("filtering");
    }, 150);
  }
}
