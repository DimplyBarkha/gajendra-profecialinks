
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'deichmann',
    domain: 'deichmann.com',
    loadedSelector: 'main[data-template="ProductDetailsPageTemplate"]',
    noResultsXPath: "//section[contains(@class,'m-search-in-store--desktop')]",
    zipcode: '',
  },
};
