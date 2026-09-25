const $ = selector => document.querySelector(selector);
const configuredApiUrl = (window.GENZTECHCO_CONFIG?.apiBaseUrl || "").replace(/\/$/, "");
let apiBaseUrl = localStorage.getItem("genztechco.apiUrl") || configuredApiUrl;
let token = localStorage.getItem("genztechco.adminToken") || "";
let products = [];
let messages = [];

$("#apiUrl").value = apiBaseUrl;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function setStatus(selector, message, type = "") {
  const element = $(selector);
  element.textContent = message;
  element.className = `form-status ${type}`;
}

async function api(path, options = {}) {
  if (!apiBaseUrl) throw new Error("Add your Render API URL first.");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401) logout();
    throw new Error(payload?.message || "The API returned an error.");
  }
  return payload;
}

function showApp() {
  $("#loginView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
  loadDashboard();
}

function logout() {
  token = "";
  localStorage.removeItem("genztechco.adminToken");
  $("#appView").classList.add("hidden");
  $("#loginView").classList.remove("hidden");
}

async function loadDashboard() {
  try {
    const [stats, productResult, messageResult] = await Promise.all([
      api("/api/admin/stats"),
      api("/api/admin/products"),
      api("/api/admin/messages")
    ]);
    products = productResult.items || [];
    messages = messageResult.items || [];
    $("#productStat").textContent = stats.products;
    $("#publishedStat").textContent = stats.published;
    $("#messageStat").textContent = stats.newMessages;
    $("#messageBadge").textContent = stats.newMessages;
    renderProducts();
    renderMessages();
    renderRecentProducts();
  } catch (error) {
    setStatus("#loginStatus", error.message, "error");
    if (!token) return;
  }
}

function renderRecentProducts() {
  $("#recentProducts").innerHTML = products.slice(0, 5).map(product => `
    <div class="compact-item">
      <img src="${escapeHtml(product.image)}" alt="">
      <div><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)} · ${product.isPublished ? "Published" : "Draft"}</small></div>
      <b>₹${Number(product.price).toLocaleString("en-IN")}</b>
    </div>`).join("") || `<p class="empty-table">No products yet.</p>`;
}

function renderProducts() {
  $("#productsTable").innerHTML = products.map(product => `
    <tr>
      <td><div class="table-product"><img src="${escapeHtml(product.image)}" alt=""><div><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product._id || "")}</small></div></div></td>
      <td>${escapeHtml(product.category)}</td>
      <td>₹${Number(product.price).toLocaleString("en-IN")}</td>
      <td><span class="status-pill ${product.isPublished ? "" : "off"}">${product.isPublished ? "Published" : "Draft"}</span></td>
      <td><button class="table-action" data-edit="${product._id}">Edit</button><button class="table-action delete" data-delete="${product._id}">Delete</button></td>
    </tr>`).join("") || `<tr><td colspan="5" class="empty-table">No products yet.</td></tr>`;
}

function renderMessages() {
  $("#messagesTable").innerHTML = messages.map(message => `
    <tr>
      <td><strong>${escapeHtml(message.name)}</strong><small>${escapeHtml(message.email)}</small></td>
      <td>${escapeHtml(message.topic)}</td>
      <td class="message-cell">${escapeHtml(message.message)}</td>
      <td><span class="status-pill ${message.status === "new" ? "" : "off"}">${escapeHtml(message.status)}</span></td>
      <td>${message.status === "new" ? `<button class="table-action" data-read="${message._id}">Mark read</button>` : ""}</td>
    </tr>`).join("") || `<tr><td colspan="5" class="empty-table">No messages yet.</td></tr>`;
}

function setView(view) {
  document.querySelectorAll(".admin-view").forEach(element => element.classList.add("hidden"));
  $(`#${view}View`).classList.remove("hidden");
  document.querySelectorAll(".admin-nav button").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  $("#viewTitle").textContent = view[0].toUpperCase() + view.slice(1);
}

function openProductModal(product = null) {
  $("#productModal").classList.remove("hidden");
  $("#modalBackdrop").classList.remove("hidden");
  $("#modalTitle").textContent = product ? "Edit product" : "New product";
  $("#productId").value = product?._id || "";
  $("#productName").value = product?.name || "";
  $("#productCategory").value = product?.category || "";
  $("#productPrice").value = product?.price || "";
  $("#productOldPrice").value = product?.oldPrice || "";
  $("#productRating").value = product?.rating || "";
  $("#productReviews").value = product?.reviews || "";
  $("#productBadge").value = product?.badge || "PICK";
  $("#productDeal").value = product?.deal || "";
  $("#productImage").value = product?.image || "";
  $("#productOutboundUrl").value = product?.outboundUrl || "";
  $("#productDescription").value = product?.description || "";
  $("#productBestFor").value = product?.bestFor || "";
  $("#productConsider").value = product?.consider || "";
  $("#productSpecs").value = (product?.specs || []).join(", ");
  $("#productPros").value = (product?.pros || []).join(", ");
  $("#productPublished").checked = product?.isPublished !== false;
  setStatus("#productStatus", "");
}

function closeProductModal() {
  $("#productModal").classList.add("hidden");
  $("#modalBackdrop").classList.add("hidden");
}

function formProductPayload() {
  const value = field => $(`#product${field}`).value;
  const list = field => value(field).split(",").map(item => item.trim()).filter(Boolean);
  return {
    name: value("Name"),
    category: value("Category"),
    price: Number(value("Price")),
    oldPrice: Number(value("OldPrice")),
    rating: Number(value("Rating")),
    reviews: value("Reviews"),
    badge: value("Badge"),
    deal: value("Deal"),
    image: value("Image"),
    outboundUrl: value("OutboundUrl"),
    description: value("Description"),
    bestFor: value("BestFor"),
    consider: value("Consider"),
    specs: list("Specs"),
    pros: list("Pros"),
    isPublished: $("#productPublished").checked
  };
}

$("#loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  apiBaseUrl = $("#apiUrl").value.trim().replace(/\/$/, "");
  setStatus("#loginStatus", "Connecting…");
  try {
    const result = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: $("#email").value, password: $("#password").value }) });
    token = result.token;
    localStorage.setItem("genztechco.apiUrl", apiBaseUrl);
    localStorage.setItem("genztechco.adminToken", token);
    showApp();
  } catch (error) {
    setStatus("#loginStatus", error.message, "error");
  }
});

document.querySelectorAll(".admin-nav button").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelectorAll("[data-view-link]").forEach(button => button.addEventListener("click", () => setView(button.dataset.viewLink)));
$("#newProductButton").addEventListener("click", () => openProductModal());
$("#newProductButtonSecondary").addEventListener("click", () => openProductModal());
$("#logoutButton").addEventListener("click", logout);
$("#modalClose").addEventListener("click", closeProductModal);
$("#modalCancel").addEventListener("click", closeProductModal);
$("#modalBackdrop").addEventListener("click", closeProductModal);

$("#productForm").addEventListener("submit", async event => {
  event.preventDefault();
  setStatus("#productStatus", "Saving…");
  const id = $("#productId").value;
  try {
    const result = await api(id ? `/api/admin/products/${id}` : "/api/admin/products", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(formProductPayload())
    });
    products = id ? products.map(product => product._id === id ? result : product) : [result, ...products];
    closeProductModal();
    renderProducts();
    renderRecentProducts();
    loadDashboard();
  } catch (error) {
    setStatus("#productStatus", error.message, "error");
  }
});

$("#productsTable").addEventListener("click", async event => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  if (editId) openProductModal(products.find(product => product._id === editId));
  if (deleteId && window.confirm("Delete this product from the catalog?")) {
    try {
      await api(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      products = products.filter(product => product._id !== deleteId);
      renderProducts();
      renderRecentProducts();
      loadDashboard();
    } catch (error) {
      window.alert(error.message);
    }
  }
});

$("#messagesTable").addEventListener("click", async event => {
  const messageId = event.target.dataset.read;
  if (!messageId) return;
  try {
    await api(`/api/admin/messages/${messageId}`, { method: "PATCH", body: JSON.stringify({ status: "read" }) });
    messages = messages.map(message => message._id === messageId ? { ...message, status: "read" } : message);
    renderMessages();
    loadDashboard();
  } catch (error) {
    window.alert(error.message);
  }
});

if (token && apiBaseUrl) showApp();
