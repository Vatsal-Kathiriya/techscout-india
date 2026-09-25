const products = [
  {id:1,category:"Phones",name:"Nothing Phone (2a) 5G",price:23999,old:27999,rating:"4.4",reviews:"1,842",badge:"OUR PICK",deal:"14% off",image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&q=80",description:"A beautifully balanced 5G phone with a clean Nothing OS experience, capable cameras and standout transparent design.",specs:["6.7-inch flexible AMOLED display","MediaTek Dimensity 7200 Pro","50MP dual rear camera","5,000mAh battery"]},
  {id:2,category:"Laptops",name:"ASUS Vivobook 15 OLED",price:62990,old:74990,rating:"4.5",reviews:"923",badge:"BEST VALUE",deal:"16% off",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80",description:"A bright OLED laptop built for work, study and everyday creativity, with a slim profile and all-day comfort.",specs:["15.6-inch OLED display","Intel Core i5 processor","16GB RAM and 512GB SSD","Backlit keyboard"]},
  {id:3,category:"Audio",name:"Sony WH-1000XM5",price:28990,old:34990,rating:"4.6",reviews:"3,210",badge:"TOP RATED",deal:"17% off",image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80",description:"Sony's premium wireless headphones pair class-leading noise cancellation with rich, detailed sound.",specs:["Industry-leading noise cancellation","Up to 30 hours battery","Multipoint Bluetooth","Speak-to-chat technology"]},
  {id:4,category:"Accessories",name:"Anker 323 Power Bank 20,000mAh",price:1599,old:2999,rating:"4.3",reviews:"8,610",badge:"DEAL",deal:"47% off",image:"https://images.unsplash.com/photo-1609592424820-9d4b53f17a4c?auto=format&fit=crop&w=700&q=80",description:"Reliable everyday power in a compact body, with enough capacity to keep your phone charged through busy days.",specs:["20,000mAh capacity","20W USB-C output","Dual USB ports","MultiProtect safety system"]},
  {id:5,category:"Wearables",name:"Samsung Galaxy Watch6",price:20999,old:36999,rating:"4.2",reviews:"1,206",badge:"SMART PICK",deal:"43% off",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",description:"A polished smartwatch for health, fitness and notifications, with a bright display and comfortable fit.",specs:["1.5-inch Super AMOLED display","Advanced sleep coaching","Body composition analysis","Up to 40 hours battery"]},
  {id:6,category:"Phones",name:"OnePlus Nord CE 4 Lite 5G",price:19998,old:21999,rating:"4.3",reviews:"674",badge:"NEW",deal:"9% off",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&q=80",description:"A smooth, fast 5G daily driver with a large AMOLED screen, long battery life and fast charging.",specs:["6.67-inch 120Hz AMOLED","Snapdragon 695 5G","80W SUPERVOOC charging","5,500mAh battery"]},
  {id:7,category:"Laptops",name:"Apple MacBook Air M2",price:84990,old:99900,rating:"4.8",reviews:"2,453",badge:"EDITOR'S PICK",deal:"15% off",image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80",description:"A silent, slim and dependable laptop with Apple's M2 chip, excellent battery life and a beautiful display.",specs:["13.6-inch Liquid Retina display","Apple M2 chip","8GB unified memory","Up to 18 hours battery"]},
  {id:8,category:"Audio",name:"JBL Tune 770NC Wireless",price:5999,old:7999,rating:"4.4",reviews:"5,890",badge:"DEAL",deal:"25% off",image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=80",description:"Comfortable wireless headphones with adaptive noise cancellation and punchy JBL sound for less.",specs:["Adaptive noise cancellation","Up to 70 hours battery","Bluetooth 5.3","Foldable lightweight design"]}
];

const catalogMeta = {
  label: "Editorial snapshot",
  note: "Prices and product details are sample snapshots until an approved marketplace feed is connected."
};

const editorialNotes = {
  1: {bestFor: "Everyday phone buyers", pros: ["Distinctive design", "Clean software", "Strong battery life"], consider: "Not the best pick for heavy gaming."},
  2: {bestFor: "Work and study", pros: ["Excellent OLED display", "Comfortable keyboard", "Plenty of memory"], consider: "Not designed for demanding gaming."},
  3: {bestFor: "Frequent travellers", pros: ["Excellent ANC", "Premium comfort", "Reliable multipoint"], consider: "Premium price for premium sound."},
  4: {bestFor: "Everyday carry", pros: ["Large capacity", "USB-C charging", "Good value"], consider: "Heavier than a compact pocket power bank."},
  5: {bestFor: "Health-conscious users", pros: ["Useful health tools", "Bright display", "Polished software"], consider: "Some features work best with a Samsung phone."},
  6: {bestFor: "Budget 5G shoppers", pros: ["Long battery life", "Fast charging", "Smooth display"], consider: "Camera performance is practical rather than flagship."},
  7: {bestFor: "Portable productivity", pros: ["Excellent battery life", "Silent performance", "Sharp display"], consider: "Port selection is intentionally minimal."},
  8: {bestFor: "Affordable ANC", pros: ["Long battery life", "Comfortable fit", "Strong discount"], consider: "Materials feel more practical than luxurious."}
};

products.forEach(product => Object.assign(product, editorialNotes[product.id]));

if (typeof module !== "undefined") {
  module.exports = { products, catalogMeta };
}
