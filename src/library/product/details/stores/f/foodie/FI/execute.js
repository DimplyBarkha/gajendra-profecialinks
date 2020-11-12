
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'foodie',
    domain: 'foodie.fi',
    loadedSelector: 'h1#product-name',
    noResultsXPath: "//h1[contains(text(),'Hakemaasi sivua ei löydy (404)')]",
    zipcode: '',
  },
};
