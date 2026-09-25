let category = "All";
let query = "";
let sort = "featured";
let visible = 6;

const $ = selector => document.querySelector(selector);
const money = value => "₹" + Number(value || 0).toLocaleString("en-IN");
const storageKeys = { saved: "techscout.saved" };
const apiBaseUrl = (window.GENZTECHCO_CONFIG?.apiBaseUrl || "").replace(/\/$/, "");
const idKey = value => String(value);
const categoryIcons = { All: "✦", Phones: "▣", Laptops: "▱", Audio: "◉", Wearables: "◌", Accessories: "⌁" };

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function readStoredIds(key) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
    return new Set(
      Array.isArray(parsed)
        ? parsed.map(idKey)
        : []
    );
  } catch (error) {
    console.warn(`Unable to read ${key} from local storage.`, error);
    return new Set();
  }
}

function persistIds(key, ids) {
  try {
    window.localStorage.setItem(key, JSON.stringify([...ids]));
  } catch (error) {
    console.warn(`Unable to save ${key} to local storage.`, error);
  }
}

const saved = readStoredIds(storageKeys.saved);

function productUrl(id) {
  return `product.html?id=${encodeURIComponent(id)}`;
}

function normaliseProduct(product) {
  return {
    ...product,
    id: product.legacyId ?? product.id ?? product._id,
    old: product.oldPrice ?? product.old ?? product.price,
    rating: String(product.rating ?? "0"),
    reviews: String(product.reviews ?? "0"),
    bestFor: product.bestFor || "Everyday use",
    pros: product.pros || [],
    specs: product.specs || []
  };
}

function renderCategories() {
  const categoryList = $(".category-list");
  const knownCategories = Object.keys(categoryIcons).filter(name => name === "All" || products.some(product => product.category === name));
  const newCategories = [...new Set(products.map(product => product.category))]
    .filter(name => !knownCategories.includes(name))
    .sort((a, b) => a.localeCompare(b));
  const categories = [...knownCategories, ...newCategories];
  if (!categories.includes(category)) category = "All";

  categoryList.innerHTML = categories.map(name => {
    const count = name === "All" ? products.length : products.filter(product => product.category === name).length;
    const label = count === 1 ? "pick" : "picks";
    return `<button class="category ${category === name ? "active" : ""}" data-category="${escapeHtml(name)}"><span class="category-icon">${categoryIcons[name] || "✦"}</span><b>${escapeHtml(name === "All" ? "All tech" : name)}</b><small>${count} ${label}</small></button>`;
  }).join("");

  categoryList.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
      category = button.dataset.category;
      visible = 6;
      render();
      $("#products").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function render() {
  renderCategories();
  let list = products.filter(product => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));

  const grid = $("#productGrid");
  grid.innerHTML = "";
  list.slice(0, visible).forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.open = product.id;
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${product.name}`);
    card.innerHTML = `
      <div class="product-image">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
      <span class="product-badge">${escapeHtml(product.badge)}</span>
      <button class="heart ${saved.has(idKey(product.id)) ? "saved" : ""}" data-save="${escapeHtml(product.id)}" aria-label="${saved.has(idKey(product.id)) ? "Remove" : "Save"} ${escapeHtml(product.name)}">
          ${saved.has(idKey(product.id)) ? "♥" : "♡"}
        </button>
      </div>
      <div class="product-info">
      <div class="product-category">${escapeHtml(product.category)}</div>
      <div class="product-name">${escapeHtml(product.name)}</div>
      <div class="product-fit">Best for ${escapeHtml(product.bestFor)}</div>
      <div class="rating">★★★★★ <span>${escapeHtml(product.rating)} sample score · ${escapeHtml(product.reviews)} reviews</span></div>
        <div class="product-bottom">
          <div>
            <div class="price">${money(product.price)} <del>${money(product.old)}</del></div>
          <div class="deal">${escapeHtml(product.deal)}</div>
          </div>
        <button class="buy-button" data-buy="${escapeHtml(product.id)}">View details ↗</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  $("#productCount").textContent = products.length;
  $("#resultsLabel").textContent = `Showing ${Math.min(list.length, visible)} of ${list.length} picks`;
  $("#emptyState").classList.toggle("hidden", list.length > 0);
  $("#loadMore").classList.toggle("hidden", visible >= list.length || list.length === 0);
  $("#clearFilters").classList.toggle("hidden", category === "All" && !query);
  renderSavedDrawer();
}

function renderSavedDrawer() {
  const savedList = $("#savedList");
  const savedProducts = products.filter(product => saved.has(idKey(product.id)));
  $("#wishlistCount").textContent = savedProducts.length;
  $("#cartCount").textContent = savedProducts.length;

  if (!savedProducts.length) {
    savedList.innerHTML = `
      <div class="saved-empty">
        <div class="saved-empty-icon">♡</div>
        <h3>Your shortlist is empty</h3>
        <p>Save products while you compare them. They will stay here on your next visit.</p>
      </div>`;
    return;
  }

  savedList.innerHTML = savedProducts.map(product => `
    <div class="saved-item">
      <a href="${productUrl(product.id)}" class="saved-item-image"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}"></a>
      <div class="saved-item-copy">
        <span>${escapeHtml(product.category)}</span>
        <a href="${productUrl(product.id)}">${escapeHtml(product.name)}</a>
        <strong>${money(product.price)}</strong>
      </div>
      <button class="saved-remove" data-remove-save="${escapeHtml(product.id)}" aria-label="Remove ${escapeHtml(product.name)}">×</button>
    </div>`).join("");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function openSavedDrawer() {
  $("#savedDrawer").classList.add("open");
  $("#savedDrawer").setAttribute("aria-hidden", "false");
  $("#drawerBackdrop").classList.remove("hidden");
  document.body.classList.add("drawer-open");
}

function closeSavedDrawer() {
  $("#savedDrawer").classList.remove("open");
  $("#savedDrawer").setAttribute("aria-hidden", "true");
  $("#drawerBackdrop").classList.add("hidden");
  document.body.classList.remove("drawer-open");
}

$("#searchInput").addEventListener("input", event => {
  query = event.target.value.trim();
  visible = 6;
  render();
});

$("#sortSelect").addEventListener("change", event => {
  sort = event.target.value;
  render();
});

$("#clearFilters").addEventListener("click", () => {
  $("#searchInput").value = "";
  query = "";
  category = "All";
  const active = $(".category.active");
  if (active) active.classList.remove("active");
  $(".category").classList.add("active");
  render();
});

$("#loadMore").addEventListener("click", () => {
  visible += 3;
  render();
});

$("#productGrid").addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const productButton = event.target.closest("[data-buy]");
  const card = event.target.closest("[data-open]");

  if (saveButton) {
    const id = idKey(saveButton.dataset.save);
    if (saved.has(id)) {
      saved.delete(id);
      showToast("Removed from your shortlist");
    } else {
      saved.add(id);
      showToast("Saved to your shortlist");
    }
    persistIds(storageKeys.saved, saved);
    render();
    return;
  }

  if (productButton || card) {
    window.location.href = productUrl((productButton || card).dataset.buy || card.dataset.open);
  }
});

$("#productGrid").addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open]")) {
    event.preventDefault();
    window.location.href = productUrl(event.target.dataset.open);
  }
});

$("#savedList").addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove-save]");
  if (!removeButton) return;
  saved.delete(idKey(removeButton.dataset.removeSave));
  persistIds(storageKeys.saved, saved);
  showToast("Removed from your shortlist");
});

$("#wishlistButton").addEventListener("click", openSavedDrawer);
$("#cartButton").addEventListener("click", openSavedDrawer);
$("#drawerClose").addEventListener("click", closeSavedDrawer);
$("#drawerBackdrop").addEventListener("click", closeSavedDrawer);
$("#drawerBrowse").addEventListener("click", closeSavedDrawer);

document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    $("#searchInput").focus();
  }
  if (event.key === "Escape") closeSavedDrawer();
});

async function loadRemoteProducts() {
  render();
  if (!apiBaseUrl) return;

  try {
    const response = await fetch(`${apiBaseUrl}/api/products?pageSize=100`);
    if (!response.ok) throw new Error(`Product API returned ${response.status}.`);
    const payload = await response.json();
    if (!Array.isArray(payload.items) || payload.items.length === 0) throw new Error("Product API returned no published products.");
    products.splice(0, products.length, ...payload.items.map(normaliseProduct));
    $("#catalogStatusLabel").textContent = "Connected catalog";
    $("#catalogStatusText").textContent = "Product details are loaded from your configured catalog API.";
  } catch (error) {
    console.warn("Unable to load the configured product API. Showing the editorial catalog.", error);
  }
  render();
}

loadRemoteProducts();
