import { loadHeaderFooter, alertMessage, removeAllAlerts } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer templates
loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary");
myCheckout.init();

document
  .querySelector("#zip")
  .addEventListener("blur", myCheckout.calculateOrderTotal.bind(myCheckout));

// listening for click on the button
document
  .querySelector("#checkoutSubmit")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    // Check if form is valid
    const myForm = document.forms[0];
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();

    if (chk_status) {
      try {
        // Remove any existing alerts
        removeAllAlerts();

        // Attempt checkout
        await myCheckout.checkout(myForm);
        // console.log("Checkout successful:", response);

        // Clear the cart from localStorage
        localStorage.removeItem("so-cart");

        // Redirect to success page
        window.location.href = "/checkout/success.html";
      } catch (error) {
        // Handle checkout errors
        // console.error("Checkout error:", error);

        // Remove any existing alerts before showing new ones
        removeAllAlerts();

        // Display error messages
        if (error.message && Array.isArray(error.message)) {
          // Server returned multiple error messages
          error.message.forEach((msg) => {
            alertMessage(msg);
          });
        } else if (error.message && typeof error.message === "object") {
          // Server returned an object with error details
          for (const key in error.message) {
            alertMessage(`${key}: ${error.message[key]}`);
          }
        } else if (error.message) {
          // Single error message
          alertMessage(error.message);
        } else {
          // Generic error message
          alertMessage("An error occurred during checkout. Please try again.");
        }
      }
    }
  });
