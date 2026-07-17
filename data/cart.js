
export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart) {
    cart = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
        deliveryOptionId: "2",
      },
    ];
  }
}

function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  let matchItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchItem = item;
    }
  });

  if (matchItem) {
    matchItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
  }

  saveToLocalStorage();
}

export function updateCartQuanity() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  const cartQuantityEl = document.querySelector(".cart-quantity");
  if (cartQuantityEl) {
    cartQuantityEl.innerHTML = cartQuantity;
  }

  const cartLinkEl = document.querySelector(".js-cart-link");
  if (cartLinkEl) {
    cartLinkEl.innerHTML = `${cartQuantity} items`;
  }

  saveToLocalStorage();
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToLocalStorage();
  }
}
export function removeFromCart(productCartId) {
  let newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productCartId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToLocalStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchItem = item;
    }
  });

  matchItem.deliveryOptionId = deliveryOptionId;

  saveToLocalStorage();
}
