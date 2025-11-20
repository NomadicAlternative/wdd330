const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    if (!baseURL) {
      throw new Error("Server URL not configured. Please check .env file.");
    }
    if (!category) {
      throw new Error("Category is required.");
    }
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    if (!baseURL) {
      throw new Error("Server URL not configured. Please check .env file.");
    }
    if (!id) {
      throw new Error("Product ID is required.");
    }
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(baseURL + "checkout", options).then(convertToJson);
  }
}
