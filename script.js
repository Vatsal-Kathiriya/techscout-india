let category="All", query="", sort="featured", visible=6, saved=new Set(), bag=new Set();
const $=s=>document.querySelector(s);
const money=n=>"₹"+n.toLocaleString("en-IN");
function render(){
  let list=products.filter(p=>(category==="All"||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase()));
  if(sort==="price-low")list.sort((a,b)=>a.price-b.price);
  if(sort==="price-high")list.sort((a,b)=>b.price-a.price);
  if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
  const grid=$("#productGrid"); grid.innerHTML="";
  list.slice(0,visible).forEach(p=>{const card=document.createElement("article");card.className="product-card";card.dataset.open=p.id;card.innerHTML=`<div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span><button class="heart ${saved.has(p.id)?"saved":""}" data-save="${p.id}" aria-label="Save ${p.name}">${saved.has(p.id)?"♥":"♡"}</button></div><div class="product-info"><div class="product-category">${p.category}</div><div class="product-name">${p.name}</div><div class="rating">★★★★★ <span>${p.rating} (${p.reviews})</span></div><div class="product-bottom"><div><div class="price">${money(p.price)} <del>${money(p.old)}</del></div><div class="deal">${p.deal}</div></div><button class="buy-button" data-buy="${p.id}">View product ↗</button></div></div>`;grid.appendChild(card)});
  $("#resultsLabel").textContent=`Showing ${Math.min(list.length,visible)} of ${list.length} picks`;
  $("#emptyState").classList.toggle("hidden",list.length>0);$("#loadMore").classList.toggle("hidden",visible>=list.length||list.length===0);
  $("#clearFilters").classList.toggle("hidden",category==="All"&&!query);
}
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".category.active").classList.remove("active");b.classList.add("active");category=b.dataset.category;visible=6;render();$("#products").scrollIntoView({behavior:"smooth"})}));
$("#searchInput").addEventListener("input",e=>{query=e.target.value;visible=6;render()});
$("#sortSelect").addEventListener("change",e=>{sort=e.target.value;render()});
$("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";query="";category="All";document.querySelector(".category.active").classList.remove("active");document.querySelector(".category").classList.add("active");render()});
$("#loadMore").addEventListener("click",()=>{visible+=3;render()});
$("#productGrid").addEventListener("click",e=>{const save=e.target.closest("[data-save]"),buy=e.target.closest("[data-buy]"),card=e.target.closest("[data-open]");if(save){const id=+save.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);$("#wishlistCount").textContent=saved.size;render();toast(saved.has(id)?"Saved to your wishlist":"Removed from wishlist");return}if(buy||card){window.location.href=`product.html?id=${(buy||card).dataset.buy||(card&&card.dataset.open)}`}});
$("#cartButton").addEventListener("click",()=>toast(bag.size?`${bag.size} deal${bag.size>1?"s":""} saved in your bag`:"Your bag is empty — save a deal to begin"));
$("#wishlistButton").addEventListener("click",()=>toast(saved.size?`${saved.size} product${saved.size>1?"s":""} in your wishlist`:"Your wishlist is empty"));
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus()}});
render();
