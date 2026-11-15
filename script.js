// Leumue Jewellery - script.js (used by every page)

// ----- 1. Product data: one object for each product -----
var products = [
  {id: 1, name: "Double-Layer Star Bracelet", price: 129, image: "product1.png", material: "s925 sterling silver", description: "A double-layer star bracelet with a Y2K feel. Small, delicate and cute."},
  {id: 2, name: "Orbit Galaxy Bracelet", price: 125, image: "product2.png", material: "s925 sterling silver", description: "A multi-element bracelet inspired by orbiting galaxies. A niche accessory with a refined, upscale feel."},
  {id: 3, name: "Pillow Girl Collarbone Chain", price: 76, image: "product3.png", material: "s925 sterling silver", description: "A simple collarbone chain that goes with everything. Minimalist and easy to wear every day."},
  {id: 4, name: "Mountain View Bracelet", price: 110, image: "product4.png", material: "s925 sterling silver", description: "A design-led bracelet in a cool mint-green tone, with a calm, understated look."},
  {id: 5, name: "Irregular Textured Ring", price: 52, image: "product5.png", material: "s925 sterling silver", description: "A ring with an irregular, textured surface. Every piece feels distinctive."},
  {id: 6, name: "Opal Star Stud Earrings", price: 82, image: "product6.png", material: "s925 sterling silver", description: "For the one who loves all things cosmic and longs to sparkle. These little star studs catch the light with every move."}
];

// ----- 2. Helper functions -----

// Find a product by its id number
function findProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return products[i];
    }
  }
  return null;
}

// Show a number as a price, for example 129 becomes "RM 129.00"
function formatPrice(number) {
  return "RM " + number.toFixed(2);
}

// ----- 3. Cart functions -----
// The cart is a list of items like {id: 3, qty: 2}.
// It is saved in the browser (localStorage) so it stays when you change pages.

// Read the saved cart text. "try" runs the normal way first.
// If the browser blocks localStorage, "catch" uses window.name instead.
function readStorage() {
  try {
    return localStorage.getItem("cart");
  } catch (error) {
    return window.name;
  }
}

function writeStorage(text) {
  try {
    localStorage.setItem("cart", text);
  } catch (error) {
    window.name = text;
  }
}

function getCart() {
  var saved = readStorage();
  if (saved && saved.charAt(0) == "[") {
    return JSON.parse(saved);
  }
  return [];
}

function saveCart(cart) {
  writeStorage(JSON.stringify(cart));
  updateCount();
}

// Update the number beside "Cart" in the navigation bar
function updateCount() {
  var cart = getCart();
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count = count + cart[i].qty;
  }
  document.getElementById("cart-count").innerHTML = count;
}

// Add a product to the cart
function addToCart(id, qty) {
  var cart = getCart();
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + qty;
      found = true;
    }
  }
  if (found == false) {
    cart.push({id: id, qty: qty});
  }
  saveCart(cart);
}

// Change the quantity of a product in the cart (amount is +1 or -1)
function changeQty(id, amount) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + amount;
      if (cart[i].qty < 1) {
        cart[i].qty = 1;
      }
    }
  }
  saveCart(cart);
  showCart();
}

// Remove a product from the cart
function removeItem(id) {
  var cart = getCart();
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id != id) {
      newCart.push(cart[i]);
    }
  }
  saveCart(newCart);
  showCart();
}

// ----- 4. Product page -----
var currentId = 0;

// Fill the product page with the product chosen in the URL (product.html?id=3)
function showProduct() {
  var params = new URLSearchParams(window.location.search);
  currentId = parseInt(params.get("id"));
  var product = findProduct(currentId);

  if (product == null) {
    document.getElementById("product-box").innerHTML = "<div><p>We could not find that piece.</p><a class='btn' href='shop.html'>Back to shop</a></div>";
    return;
  }
  document.getElementById("p-photo").src = product.image;
  document.getElementById("p-photo").alt = product.name;
  document.getElementById("p-name").innerHTML = product.name;
  document.getElementById("p-price").innerHTML = formatPrice(product.price);
  document.getElementById("p-desc").innerHTML = product.description;
  document.getElementById("p-material").innerHTML = product.material;
}

// Read the quantity typed by the customer (at least 1)
function getQuantity() {
  var qty = parseInt(document.getElementById("quantity").value);
  if (isNaN(qty) || qty < 1) {
    qty = 1;
  }
  return qty;
}

// "Add to cart" button
function addButton() {
  addToCart(currentId, getQuantity());
  document.getElementById("message").innerHTML = "Added to your cart. <a href='cart.html'><u>View cart</u></a>";
}

// "Buy now" button: add the product, then go straight to checkout
function buyNow() {
  addToCart(currentId, getQuantity());
  window.location.href = "checkout.html";
}

// ----- 5. Cart page -----
function showCart() {
  var cart = getCart();

  if (cart.length == 0) {
    document.getElementById("cart-box").innerHTML = "<p>Your cart is empty.</p><br><a class='btn' href='shop.html'>Browse the shop</a>";
    return;
  }

  var rows = "";
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    var subtotal = product.price * cart[i].qty;
    total = total + subtotal;
    rows = rows + "<tr>" +
      "<td>" + product.name + "</td>" +
      "<td>" + formatPrice(product.price) + "</td>" +
      "<td><button onclick='changeQty(" + product.id + ", -1)'>-</button> " + cart[i].qty + " <button onclick='changeQty(" + product.id + ", 1)'>+</button></td>" +
      "<td>" + formatPrice(subtotal) + "</td>" +
      "<td><button onclick='removeItem(" + product.id + ")'>Remove</button></td>" +
      "</tr>";
  }
  document.getElementById("cart-body").innerHTML = rows;
  document.getElementById("cart-total").innerHTML = formatPrice(total);
}

// ----- 6. Checkout page -----

// Show the order summary (the same items as the cart, but without buttons)
function showSummary() {
  var cart = getCart();

  if (cart.length == 0) {
    document.getElementById("checkout-box").innerHTML = "<p>Your cart is empty.</p><br><a class='btn' href='shop.html'>Browse the shop</a>";
    return;
  }

  var rows = "";
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    var subtotal = product.price * cart[i].qty;
    total = total + subtotal;
    rows = rows + "<tr><td>" + product.name + "</td><td>" + cart[i].qty + "</td><td>" + formatPrice(subtotal) + "</td></tr>";
  }
  document.getElementById("summary-body").innerHTML = rows;
  document.getElementById("summary-total").innerHTML = formatPrice(total);
}

// Runs when the "Place order" button is pressed
function placeOrder() {
  var name = document.getElementById("name").value;
  saveCart([]);
  document.getElementById("checkout-box").innerHTML = "<h2>Order placed</h2><p>Thank you, <span id='who'></span>. We will send a confirmation soon.</p><br><a class='btn' href='index.html'>Back to home</a>";
  document.getElementById("who").textContent = name;
  return false;
}

// ----- 7. Runs on every page -----
updateCount();
