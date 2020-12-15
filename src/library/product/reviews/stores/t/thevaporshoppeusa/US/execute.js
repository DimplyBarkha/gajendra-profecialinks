
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    domain: 'thevaporshoppeusa.com',
    loadedSelector: 'div[class*="product-page"]',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")] | //span[contains(text(),"No reviews yet")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
