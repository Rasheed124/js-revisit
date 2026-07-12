import { products } from "./products.js";

function Cart(localStorageType) {
  const cart = {
    cartItems: undefined,

    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(localStorageType));

      if (!this.cartItems) {
        this.cartItems = [
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
    },

    saveToLocalStorage() {
      localStorage.setItem(localStorageType, JSON.stringify(this.cartItems));
    },

    addToCart(productId) {
      let matchItem;
      this.cartItems.forEach((item) => {
        if (productId === item.productId) {
          matchItem = item;
        }
      });

      if (matchItem) {
        matchItem.quantity += 1;
      } else {
        this.cartItems.push({
          productId: productId,
          quantity: 1,
          deliveryOptionId: "1",
        });
      }

      this.saveToLocalStorage();
    },

    removeFromCart(productCartId) {
      let newCart = [];

      this.cartItems.forEach((cartItem) => {
        if (cartItem.productId !== productCartId) {
          newCart.push(cartItem);
        }
      });

      this.cartItems = newCart;
      this.saveToLocalStorage();
    },

    updateDeliveryOption(productId, deliveryOptionId) {
      let matchItem;
      this.cartItems.forEach((item) => {
        if (productId === item.productId) {
          matchItem = item;
        }
      });

      matchItem.deliveryOptionId = deliveryOptionId;

      this.saveToLocalStorage();
    },

    updateCartQuanity() {
      let cartQuantity = 0;

      this.cartItems.forEach((item) => {
        cartQuantity += item.quantity;
      });

      document.querySelector(".cart-quantity").innerHTML = cartQuantity;

      this.saveToLocalStorage();
    },
  };
  return cart;
}

const cart = Cart("cart-oop");
const businessCart = Cart("cart-business");

cart.loadFromStorage();

businessCart.loadFromStorage();

console.log(cart);
console.log(businessCart);
