import { PRODUCTS, PRODUCT_BY_ID, COLLECTIONS } from "../data/products";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("shubhdeep_admin_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function getCustomerAuthHeaders() {
  const token = localStorage.getItem("shubhdeep_customer_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // --- Public APIs ---
  async getHealth() {
    try {
      const res = await fetch(`${BASE_URL}${API_PREFIX}/health`);
      return await res.json();
    } catch {
      return { status: "offline", database: "disconnected" };
    }
  },

  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.sort_by) query.append("sort_by", params.sort_by);
    if (params.min_price !== undefined && params.min_price !== null && params.min_price !== "") {
      query.append("min_price", params.min_price);
    }
    if (params.max_price !== undefined && params.max_price !== null && params.max_price !== "") {
      query.append("max_price", params.max_price);
    }
    if (params.in_stock_only) query.append("in_stock_only", "true");
    if (params.is_deal) query.append("is_deal", "true");
    if (params.page) query.append("page", params.page);
    if (params.page_size) query.append("page_size", params.page_size);

    try {
      const res = await fetch(`${BASE_URL}${API_PREFIX}/products?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Backend unavailable, using static products fallback:", err.message);
      let items = [...PRODUCTS];
      if (params.category) {
        items = items.filter(p => p.collection === params.category || p.category_slug === params.category);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      if (params.min_price) {
        items = items.filter(p => Number(p.price) >= Number(params.min_price));
      }
      if (params.max_price) {
        items = items.filter(p => Number(p.price) <= Number(params.max_price));
      }
      return {
        items,
        total: items.length,
        page: 1,
        page_size: items.length,
        total_pages: 1,
        is_fallback: true
      };
    }
  },

  async getDealOfTheDay() {
    try {
      const res = await fetch(`${BASE_URL}${API_PREFIX}/products/deal-of-the-day`);
      if (!res.ok) throw new Error("Failed to load deal of the day");
      return await res.json();
    } catch {
      // Fallback to top discounted product from static data
      return PRODUCTS[0];
    }
  },

  async getProduct(idOrSlug) {
    try {
      const res = await fetch(`${BASE_URL}${API_PREFIX}/products/${idOrSlug}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Backend unavailable, using static fallback for product:", idOrSlug);
      const prod = PRODUCT_BY_ID[idOrSlug] || PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (!prod) throw new Error("Product not found");
      return prod;
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}${API_PREFIX}/categories`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Backend unavailable, using static collections fallback:", err.message);
      return COLLECTIONS.map((c, i) => ({
        id: i + 1,
        slug: c.id,
        name: c.title,
        description: c.description,
        product_count: PRODUCTS.filter(p => p.collection === c.id).length
      }));
    }
  },

  async createOrder(orderData) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Order placement failed with code ${res.status}`);
    }
    return await res.json();
  },

  async trackOrder(orderNumber, phone = "") {
    let url = `${BASE_URL}${API_PREFIX}/orders/track/${encodeURIComponent(orderNumber.trim())}`;
    if (phone) {
      url += `?phone=${encodeURIComponent(phone.trim())}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Order not found");
    }
    return await res.json();
  },

  async getOrdersByPhone(phone) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/orders/by-phone/${encodeURIComponent(phone.trim())}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to find orders for this phone number");
    }
    return await res.json();
  },

  // --- Auth APIs ---
  async login(email, password) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Invalid email or password");
    }
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Unauthorized");
    return await res.json();
  },

  // --- Customer / User Auth & Account APIs ---
  async customerRegister(data) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/customer/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Registration failed. Please check your information.");
    }
    return await res.json();
  },

  async customerLogin(email_or_phone, password) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_or_phone, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Invalid email/mobile number or password.");
    }
    return await res.json();
  },

  async getCustomerMe() {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/customer/me`, {
      headers: getCustomerAuthHeaders()
    });
    if (!res.ok) throw new Error("Unauthorized customer session");
    return await res.json();
  },

  async updateCustomerProfile(data) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/customer/profile`, {
      method: "PUT",
      headers: getCustomerAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update profile");
    }
    return await res.json();
  },

  async getCustomerOrders() {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/customer/orders`, {
      headers: getCustomerAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load customer orders");
    return await res.json();
  },

  // --- Admin APIs ---
  async getAdminDashboard() {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load dashboard metrics");
    return await res.json();
  },

  async getAdminProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", params.page);
    if (params.page_size) query.append("page_size", params.page_size);
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/products?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load products");
    return await res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create product");
    }
    return await res.json();
  },

  async updateProduct(productId, productData) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/products/${productId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update product");
    }
    return await res.json();
  },

  async deleteProduct(productId) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/products/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return await res.json();
  },

  async getAdminOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", params.page);
    if (params.page_size) query.append("page_size", params.page_size);

    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/orders?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load orders");
    return await res.json();
  },

  async getAdminOrder(orderId) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load order details");
    return await res.json();
  },

  async updateOrderStatus(orderId, statusData) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update order status");
    }
    return await res.json();
  },

  async getInventory() {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/inventory`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load inventory");
    return await res.json();
  },

  async updateInventory(productId, stockQuantity, isAvailable = null) {
    let url = `${BASE_URL}${API_PREFIX}/admin/inventory/${productId}?stock_quantity=${stockQuantity}`;
    if (isAvailable !== null) {
      url += `&is_available=${isAvailable}`;
    }
    const res = await fetch(url, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to update stock");
    return await res.json();
  },

  async createCategory(categoryData) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to create category");
    }
    return await res.json();
  },

  async updateCategory(categoryId, categoryData) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/categories/${categoryId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to update category");
    }
    return await res.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("shubhdeep_admin_token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/upload`, {
      method: "POST",
      headers,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Image upload failed");
    }
    const data = await res.json();
    // Prepend BASE_URL if relative /uploads path
    if (data.url.startsWith("/")) {
      data.url = `${BASE_URL}${data.url}`;
    }
    return data;
  },

  async getAdminCustomers(search = "") {
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/customers?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load customer list");
    return await res.json();
  },

  async getAdminCustomerDetails(phone) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/customers/${encodeURIComponent(phone)}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load customer details");
    return await res.json();
  },

  async getAdminAnalytics(days = 30) {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/admin/analytics?days=${days}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load analytics data");
    return await res.json();
  },

  async setDealOfTheDay(productId, discountPrice = null, hours = 24) {
    let url = `${BASE_URL}${API_PREFIX}/admin/deal-of-the-day/${productId}?hours=${hours}`;
    if (discountPrice) {
      url += `&discount_price=${discountPrice}`;
    }
    const res = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to set deal of the day");
    return await res.json();
  }
};
