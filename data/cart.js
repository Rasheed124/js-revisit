export const cart = [];

export function addToCart(productId) {
  let matchItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchItem = item;
    }
  });

  if (matchItem) {
    matchItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  }
}

export function updateCartQuanity() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  document.querySelector(".cart-quantity").innerHTML = cartQuantity;
}
