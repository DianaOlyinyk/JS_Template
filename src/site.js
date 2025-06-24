let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
    <div class="cart-item-content">
      <strong class="pizza-name">${item.name} (${item.size})</strong><br>
      <span class="pizza-price">${item.price} грн × ${item.count} = ${item.price * item.count} грн</span>
      <div class="cart-buttons">
        <button class="minus-btn" onclick="changeCount(${index}, -1)">−</button>
        <button class="plus-btn" onclick="changeCount(${index}, 1)">+</button>
        <button class="remove-btn" onclick="removeItem(${index})">✕</button>
        <img src="${item.image}" alt="${item.name}" class="pizza-image"/>
      </div>
    </div>
  `;
    cartItems.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = `${total} грн`;
  saveCart();
}

function changeCount(index, delta) {
  cart[index].count += delta;
  if (cart[index].count <= 0) cart.splice(index, 1);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function addToCart(name, size, price, image) {
  const existing = cart.find(p => p.name === name && p.size === size);
  if (existing) {
    existing.count++;
  } else {
    cart.push({ name, size, price, image, count: 1 });
  }
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const size = btn.dataset.size;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;
      addToCart(name, size, price, image);
    });
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  renderCart(); 
});

let allPizzas = [];

function renderPizzaList(pizzas) {
  const list = document.querySelector(".pizza-list");
  list.innerHTML = "";
  pizzas.forEach(pizza => {
    list.innerHTML += `
      <div class="pizza-card">
        <img src="${pizza.image}" alt="${pizza.name}">
        ${pizza.label ? `<span class="label">${pizza.label}</span>` : ""}
        <h3>${pizza.name}</h3>
        <p>${pizza.description}</p>
        <div class="sizes">
          <div>${pizza.small.size}см • ${pizza.small.weight}г</div>
          <div>${pizza.large.size}см • ${pizza.large.weight}г</div>
        </div>
        <div class="prices">
          <button class="buy-btn" data-name="${pizza.name}" data-size="Мала" data-price="${pizza.small.price}">${pizza.small.price} грн</button>
          <button class="buy-btn" data-name="${pizza.name}" data-size="Велика" data-price="${pizza.large.price}">${pizza.large.price} грн</button>
        </div>
      </div>`;
  });

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const size = btn.dataset.size;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;
      addToCart(name, size, price, image);
    });
  });
}

function applyFilter(category) {
  if (category === "усі") {
    renderPizzaList(allPizzas);
  } else {
    const filtered = allPizzas.filter(pizza =>
      pizza.ingredients.includes(category)
    );
    renderPizzaList(filtered);
  }
}

fetch("pizzas.json")
  .then(res => res.json())
  .then(data => {
    allPizzas = data;
    renderPizzaList(allPizzas);
  });

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });
});
