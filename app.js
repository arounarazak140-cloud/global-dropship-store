
const products = [
  { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59, emoji: "🎧" },
  { id: 2, name: "Phone Stand", category: "Accessories", price: 25, emoji: "📱" },
  { id: 3, name: "Travel Backpack", category: "Travel", price: 89, emoji: "🎒" },
  { id: 4, name: "LED Desk Lamp", category: "Home", price: 65, emoji: "💡" },
  { id: 5, name: "Smart Watch", category: "Electronics", price: 99, emoji: "⌚" },
  { id: 6, name: "Water Bottle", category: "Travel", price: 29, emoji: "🧴" },
  { id: 7, name: "Desk Organizer", category: "Home", price: 35, emoji: "🗂️" },
  { id: 8, name: "Phone Case", category: "Accessories", price: 19, emoji: "📲" }
];

// Demo catalog only. These are not real supplier listings.
const cart = new Map();
let selectedCategory = "All";

const productContainer = document.getElementById("products");
const categoriesContainer = document.getElementById("categories");
const cartPanel = document.getElementById("cart-panel");

const money = amount =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED"
  }).format(amount);

function renderCategories() {
  const categories = [
    "All",
    ...new Set(products.map(product => product.category))
  ];

  categoriesContainer.replaceChildren();

  categories.forEach(category => {
    const button = document.createElement("button");
    button.className =
      "category-button" +
      (selectedCategory === category ? " active" : "");
    button.textContent = category;
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
      renderProducts();
    });
    categoriesContainer.append(button);
  });
}

function renderProducts() {
  const search = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  productContainer.replaceChildren();

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const visual = document.createElement("div");
    visual.className = "product-visual";
    visual.setAttribute("aria-hidden", "true");
    visual.textContent = product.emoji;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = money(product.price);

    const button = document.createElement("button");
    button.className = "primary-button";
    button.textContent = "Add to cart";
    button.addEventListener("click", () => addToCart(product.id));

    card.append(visual, category, name, price, button);
    productContainer.append(card);
  });

  document.getElementById("empty-message").hidden =
    filtered.length !== 0;
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

function removeFromCart(productId) {
  cart.delete(productId);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.replaceChildren();

  let quantity = 0;
  let total = 0;

  cart.forEach((count, id) => {
    const product = products.find(item => item.id === id);
    if (!product) return;

    quantity += count;
    total += product.price * count;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = product.name;

    const subtotal = document.createElement("p");
    subtotal.textContent = `${count} × ${money(product.price)}`;

    details.append(title, subtotal);

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product.name}`);
    remove.addEventListener("click", () => removeFromCart(id));

    row.append(details, remove);
    container.append(row);
  });

  if (quantity === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty.";
    container.append(empty);
  }

  document.getElementById("cart-count").textContent = quantity;
  document.getElementById("cart-total").textContent = money(total);
}

document.getElementById("search").addEventListener("input", renderProducts);

document.getElementById("cart-toggle").addEventListener("click", () => {
  cartPanel.hidden = false;
});

document.getElementById("cart-close").addEventListener("click", () => {
  cartPanel.hidden = true;
});

document.getElementById("checkout").addEventListener("click", () => {
  alert(
    "This is a demo storefront. Checkout is disabled; no order or payment was created."
  );
});

document.getElementById("year").textContent = new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
