import { formatCurrency } from "../js/utils/money.js";

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHtml() {
    return `
   
    `;
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHtml() {
    return `
     <a href="${this.sizeChartLink}" target="_blank" > Size Chart </a>
    `;
  }
}

export function getProduct(productId) {
  let matchedProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchedProduct = product;
    }
  });

  return matchedProduct;
}

// ============================================== FETCH PRODUCT =======================================================

export let products = [];

export function loadProducts(func) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    func();

    console.log("Load products");
  });

  xhr.addEventListener("error", (error) => {
    console.log(error);
  });

  xhr.open("GET", "https://supersimplebackend.dev/products");
  xhr.send();
}

export function loadProductsFetch() {
  const promise = fetch("https://supersimplebackend.dev/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });

     console.log("products");
     
    })
    .catch((err) => {
      console.log(`Unexpected error: ${err}`);
    });

  return promise;
}
