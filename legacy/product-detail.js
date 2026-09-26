const money = value => "₹" + Number(value || 0).toLocaleString("en-IN");
const apiBaseUrl = (window.GENZTECHCO_CONFIG?.apiBaseUrl || "").replace(/\/$/, "");
const requestedProductId = new URLSearchParams(window.location.search).get("id") || "";
const page = document.querySelector("#productPage");
const idKey = value => String(value);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

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
    pros: Array.isArray(product.pros) && product.pros.length ? product.pros : ["A thoughtful option in its category"],
    specs: Array.isArray(product.specs) ? product.specs : [],
    consider: product.consider || "Check current price, availability and fit before buying."
  };
}

function getOutboundUrl(product) {
  const configuredUrl = String(product.outboundUrl || "").trim();
  if (/^https?:\/\//i.test(configuredUrl)) return configuredUrl;
  return `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`;
}

function readSavedIds() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem("techscout.saved") || "[]");
    return new Set(Array.isArray(parsed) ? parsed.map(idKey) : []);
  } catch (error) {
    console.warn("Unable to read saved products from local storage.", error);
    return new Set();
  }
}

function saveIds(ids) {
  try {
    window.localStorage.setItem("techscout.saved", JSON.stringify([...ids]));
  } catch (error) {
    console.warn("Unable to save products to local storage.", error);
  }
}

function setDetailNotice(message) {
  const notice = document.querySelector("#detailNotice");
  notice.textContent = message;
  notice.classList.add("visible");
  window.setTimeout(() => notice.classList.remove("visible"), 2600);
}

function renderNotFound() {
  page.innerHTML = `
    <section class="product-not-found">
      <p class="eyebrow">PRODUCT NOT FOUND</p>
      <h1>This pick has moved on.</h1>
      <a class="buy-button" href="index.html#products">Back to products</a>
    </section>`;
}

function renderProduct(product) {
  const saved = readSavedIds();
  const productId = idKey(product.id);
  const relatedProducts = products
    .filter(item => idKey(item.id) !== productId && item.category === product.category)
    .slice(0, 2);
  const outboundUrl = getOutboundUrl(product);

  document.title = `${product.name} | genztechco`;
  page.innerHTML = `
    <section class="product-detail">
      <a class="back-link" href="index.html#products">← Back to all products</a>
      <div class="product-detail-grid">
        <div class="detail-image">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
          <span class="product-badge">${escapeHtml(product.badge)}</span>
        </div>
        <div class="detail-copy">
          <div class="detail-kicker">
            <p class="eyebrow">${escapeHtml(product.category)}</p>
            <span class="editorial-chip">${escapeHtml(catalogMeta.label)}</span>
          </div>
          <h1>${escapeHtml(product.name)}</h1>
          <div class="detail-rating">★★★★★ <span>${escapeHtml(product.rating)} sample score · ${escapeHtml(product.reviews)} review references</span></div>
          <p class="detail-description">${escapeHtml(product.description)}</p>
          <div class="detail-price"><strong>${money(product.price)}</strong><del>${money(product.old)}</del><span>${escapeHtml(product.deal)}</span></div>
          <p class="price-note">Price shown is an editorial snapshot. Marketplace prices and availability can change.</p>
          <div class="detail-actions">
            <button class="save-detail ${saved.has(productId) ? "saved" : ""}" id="saveDetail">${saved.has(productId) ? "♥ Saved" : "♡ Save this pick"}</button>
            <button class="share-detail" id="shareDetail">Share pick ↗</button>
          </div>
          <a class="amazon-button" href="${escapeHtml(outboundUrl)}" target="_blank" rel="noopener noreferrer">See this product on Amazon.in <span>↗</span></a>
          <p class="affiliate-note">We may earn a small commission if you buy through our link, at no extra cost to you.</p>
          <div class="detail-notice" id="detailNotice" role="status"></div>
        </div>
      </div>
      <div class="detail-insight">
        <div><span>BEST FOR</span><strong>${escapeHtml(product.bestFor)}</strong></div>
        <div><span>WHY IT STANDS OUT</span><strong>${escapeHtml(product.pros[0])}</strong></div>
        <div><span>ONE THING TO CONSIDER</span><strong>${escapeHtml(product.consider)}</strong></div>
      </div>
      <div class="spec-section">
        <p class="eyebrow">AT A GLANCE</p>
        <h2>Key specifications</h2>
        <div class="spec-grid">${product.specs.map((spec, index) => `<div><span>0${index + 1}</span><b>${escapeHtml(spec)}</b></div>`).join("")}</div>
      </div>
      <div class="pros-section">
        <div><p class="eyebrow">EDITOR'S NOTES</p><h2>What to know before you buy</h2></div>
        <div class="pros-list">${product.pros.map(pro => `<div><span>+</span>${escapeHtml(pro)}</div>`).join("")}<div class="consider-item"><span>!</span>${escapeHtml(product.consider)}</div></div>
      </div>
      ${relatedProducts.length ? `<div class="related-section"><div class="section-heading"><div><p class="eyebrow">MORE LIKE THIS</p><h2>Keep comparing</h2></div><a href="index.html#products">See all <span>→</span></a></div><div class="related-grid">${relatedProducts.map(item => `<a class="related-card" href="${productUrl(item.id)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"><div><span>${escapeHtml(item.category)}</span><strong>${escapeHtml(item.name)}</strong><b>${money(item.price)}</b></div></a>`).join("")}</div></div>` : ""}
    </section>`;

  document.querySelector("#saveDetail").addEventListener("click", event => {
    if (saved.has(productId)) {
      saved.delete(productId);
      event.currentTarget.classList.remove("saved");
      event.currentTarget.textContent = "♡ Save this pick";
      setDetailNotice("Removed from your shortlist.");
    } else {
      saved.add(productId);
      event.currentTarget.classList.add("saved");
      event.currentTarget.textContent = "♥ Saved";
      setDetailNotice("Saved to your shortlist.");
    }
    saveIds(saved);
  });

  document.querySelector("#shareDetail").addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: `Take a look at ${product.name}`, url: window.location.href });
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setDetailNotice("Product link copied.");
        return;
      }
      setDetailNotice("Copy this product URL from your browser.");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.warn("Unable to share product link.", error);
        setDetailNotice("Copy this product URL from your browser.");
      }
    }
  });
}

async function loadProduct() {
  const localProduct = products.find(item => idKey(item.id) === requestedProductId);
  if (localProduct) {
    renderProduct(normaliseProduct(localProduct));
    return;
  }

  if (!apiBaseUrl || !requestedProductId) {
    renderNotFound();
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/products/${encodeURIComponent(requestedProductId)}`);
    if (!response.ok) throw new Error(`Product API returned ${response.status}.`);
    renderProduct(normaliseProduct(await response.json()));
  } catch (error) {
    console.warn("Unable to load the requested product from the configured API.", error);
    renderNotFound();
  }
}

loadProduct();
