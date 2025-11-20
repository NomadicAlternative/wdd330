const baseURL = import.meta.env.VITE_SERVER_URL;

// Check if the environment variable is set
if (!baseURL) {
  console.error('❌ ERROR: VITE_SERVER_URL is not configured!');
  console.error('📝 Please create a .env file in the root directory with:');
  console.error('   VITE_SERVER_URL=https://wdd330-backend.onrender.com/');
  console.error('\n💡 You can copy .env.sample to .env to fix this.');
}

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
