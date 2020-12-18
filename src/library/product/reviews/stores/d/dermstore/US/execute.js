module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    domain: 'dermstore.com',
    loadedSelector: 'div.reviews',
    noResultsXPath: "//h1[contains(text(),'OOPS!')]",
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
