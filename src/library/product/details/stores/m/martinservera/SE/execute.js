
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'martinservera',
    domain: 'martinservera.se',
    loadedSelector: 'div.product-detail',
    noResultsXPath: "//h1[contains(text(),'Sidan kan inte hittas')]",
    zipcode: '',
  },
};
