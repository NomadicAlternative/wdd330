import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imagePath = product.Image ? product.Image : "/images/noun_Tent_2517.svg";
  const brandName = product.Brand ? product.Brand.Name : "";
  const productName = product.NameWithoutBrand || product.Name || "Unknown Product";
  const finalPrice = product.FinalPrice || product.ListPrice || "0.00";
  const productId = product.Id || "";

  return `<li class="product-card">
    <a href="product_pages/?product=${productId}">
      <img
        src="${imagePath}"
        alt="${productName}"
      />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${productName}</h2>
      <p class="product-card__price">$${finalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    // Get the list of products from the data source
    const list = await this.dataSource.getData();
    this.products = list;
    
    // Render the list
    this.renderList(this.products);
  }

  renderList(list) {
    // Use the reusable renderListWithTemplate function
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
