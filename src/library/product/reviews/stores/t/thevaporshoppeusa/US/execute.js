
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    domain: 'thevaporshoppeusa.com',
    loadedSelector: 'div.spr-content div.spr-reviews',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
