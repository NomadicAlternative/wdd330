import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer templates
loadHeaderFooter();

// Load products from tents category for the homepage search
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

// Initialize with tents category
const productList = new ProductList("tents", dataSource, listElement);
productList.init();
