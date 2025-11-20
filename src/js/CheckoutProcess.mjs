import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    // Ensure list is an array
    if (!Array.isArray(this.list)) {
      this.list = [];
    }
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(
      `${this.outputSelector} #cartTotal`,
    );
    const itemNumElement = document.querySelector(
      `${this.outputSelector} #num-items`,
    );
    
    // Check if list is valid
    if (!this.list || this.list.length === 0) {
      itemNumElement.innerText = 0;
      summaryElement.innerText = "$0.00";
      return;
    }
    
    itemNumElement.innerText = this.list.length;
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);
    summaryElement.innerText = "$" + this.itemTotal.toFixed(2);
  }

  calculateOrderTotal() {
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.shipping) +
      parseFloat(this.tax)
    ).toFixed(2);
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shipping = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`
    );
    shipping.innerText = "$" + this.shipping.toFixed(2);
    tax.innerText = "$" + this.tax;
    orderTotal.innerText = "$" + this.orderTotal;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1,
    }));
  }

  async checkout(form) {
    const formDataToJSON = (formElement) => {
      const formData = new FormData(formElement);
      const convertedJSON = {};
      formData.forEach((value, key) => {
        convertedJSON[key] = value;
      });
      return convertedJSON;
    };

    const json = formDataToJSON(form);
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = this.packageItems(this.list);

    const res = await new ExternalServices().checkout(json);
    return res;
  }
}
