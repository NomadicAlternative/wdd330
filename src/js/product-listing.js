import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Load header and footer templates
loadHeaderFooter();

const category = getParam("category");
// first create an instance of the ExternalServices class.
const dataSource = new ExternalServices();
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

// Quick View Modal Logic
function initQuickViewModal() {
  const modal = document.getElementById("quickViewModal");
  const modalContent = document.getElementById("modalProductDetails");
  const closeModalBtn = document.querySelector(".close-modal");

  if (!modal || !modalContent || !closeModalBtn || !listElement) return;

  // Delegated event for quick view buttons
  listElement.addEventListener("click", async (e) => {
    if (e.target.classList.contains("quick-view-btn")) {
      const productId = e.target.getAttribute("data-product-id");
      if (!productId) return;
      // Fetch product details
      try {
        const product = await dataSource.findProductById(productId);
        modalContent.innerHTML = `
          <h2>${product.Name || "Product"}</h2>
          <img src="${product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || product.Image || '/images/noun_Tent_2517.svg'}" alt="${product.Name || ''}" />
          <p><strong>Brand:</strong> ${product.Brand?.Name || "N/A"}</p>
          <p><strong>Price:</strong> $${product.FinalPrice || product.ListPrice || "0.00"}</p>
          <p>${product.DescriptionHtmlSimple || "No description available."}</p>
        `;
        modal.classList.add("show");
        modal.style.display = "flex";
      } catch (err) {
        modalContent.innerHTML = `<p>Error loading product details.</p>`;
        modal.classList.add("show");
        modal.style.display = "flex";
      }
    }
  });

  // Close modal on X
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.style.display = "none";
    modalContent.innerHTML = "";
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      modalContent.innerHTML = "";
    }
  });
}

// Initialize modal after DOM is ready
initQuickViewModal();
