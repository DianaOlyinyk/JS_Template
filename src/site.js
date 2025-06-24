
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const cartContainer = document.querySelector(".cart");
  const itemsHtml = cart.map(item => `
    <div class="cart-item">
      ${item.name} (${item.size}) • ${item.count} × ${item.price} грн
      = <strong>${item.count * item.price} грн</strong>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.count * item.price, 0);

  cartContainer.innerHTML = `
    <h3>Замовлення</h3>
    ${itemsHtml}
    <div class="cart-summary">
      Сума замовлення: <strong>${total} грн</strong><br>
      <button class="order-btn">Замовити</button>
    </div>
  `;
}

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const size = btn.dataset.size;
    const price = parseInt(btn.dataset.price);

    const existing = cart.find(item => item.name === name && item.size === size);

    if (existing) {
      existing.count++;
    } else {
      cart.push({ name, size, price, count: 1 });
    }
    saveCart();
    renderCart();
  });
});

fetch('pizzas.json')
  .then(res => res.json())
  .then(data => {
    renderPizzaList(data);
    initFilters(data);
  });



function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.count;
    count += item.count;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <strong>${item.name} (${item.size})</strong><br>
        ${item.price} грн × ${item.count}
      </div>
      <div class="cart-item-controls">
        <button onclick="changeCount(${index}, -1)">−</button>
        <button onclick="changeCount(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">✕</button>
      </div>
    `;
    cartItems.appendChild(itemEl);
  });

  cartCount.textContent = count;
  cartTotal.textContent = `${total} грн`;
}

function changeCount(index, delta) {
  cart[index].count += delta;
  if (cart[index].count <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

renderCart();


function addToCart(pizza, size, price, image) {
  const existing = cart.find(p => p.name === pizza && p.size === size);
  if (existing) existing.count++;
  else cart.push({ name: pizza, size, price, count: 1, image });

  saveCart();
  renderCart();
}

