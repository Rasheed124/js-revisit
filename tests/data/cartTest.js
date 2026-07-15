import { addToCart, cart, loadFromStorage } from "../../data/cart.js";

describe("test suite: addToCart", () => {
  let store = {};

  beforeEach(() => {
    // 1. Reset our local storage mock object before every single test
    store = {};

    // 2. Safely mock localStorage methods by redefining them on window
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jasmine.createSpy('getItem').and.callFake((key) => {
          // Force it to return an empty cart array string for this test
          return JSON.stringify([]); 
        }),
        setItem: jasmine.createSpy('setItem').and.callFake((key, value) => {
          store[key] = value;
        }),
        clear: jasmine.createSpy('clear').and.callFake(() => {
          store = {};
        })
      },
      configurable: true, 
      writable: true
    });
  });

  it("adds an existing product to the cart", () => {
    // 3. Re-run initialization now that localStorage is properly mocked
    loadFromStorage();

    // 4. Run the function under test
    addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");

    // 5. Assertions will now pass correctly!
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    
    // This assertion will now work perfectly because setItem is a true Jasmine spy
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
});