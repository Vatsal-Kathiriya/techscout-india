const money = n => "₹" + n.toLocaleString("en-IN");
const id = Number(new URLSearchParams(location.search).get("id"));
const product = products.find(item => item.id === id);
const page = document.querySelector("#productPage");
if (!product) {
  page.innerHTML = `<section class="product-not-found"><p class="eyebrow">PRODUCT NOT FOUND</p><h1>This pick has moved on.</h1><a class="buy-button" href="index.html#products">Back to products</a></section>`;
} else {
  document.title = `${product.name} | TechScout India`;
  page.innerHTML = `<section class="product-detail"><a class="back-link" href="index.html#products">← Back to all products</a><div class="product-detail-grid"><div class="detail-image"><img src="${product.image}" alt="${product.name}"><span class="product-badge">${product.badge}</span></div><div class="detail-copy"><p class="eyebrow">${product.category}</p><h1>${product.name}</h1><div class="detail-rating">★★★★★ <span>${product.rating} (${product.reviews} reviews)</span></div><p class="detail-description">${product.description}</p><div class="detail-price"><strong>${money(product.price)}</strong><del>${money(product.old)}</del><span>${product.deal}</span></div><p class="price-note">Price shown is based on our latest check. Amazon may update it.</p><a class="amazon-button" href="https://www.amazon.in/s?k=${encodeURIComponent(product.name)}" target="_blank" rel="noopener noreferrer">See this product on Amazon.in <span>↗</span></a><p class="affiliate-note">We may earn a small commission if you buy through our link, at no extra cost to you.</p></div></div><div class="spec-section"><p class="eyebrow">AT A GLANCE</p><h2>Why we like it</h2><div class="spec-grid">${product.specs.map((spec,index)=>`<div><span>0${index+1}</span><b>${spec}</b></div>`).join("")}</div></div></section>`;
}
