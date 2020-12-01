
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PK',
    store: 'daraz',
    domain: 'daraz.pk',
    loadedSelector: 'span.pdp-mod-product-badge-title',
    noResultsXPath: "//h3[contains(text(),'Sorry! This product is no longer available')]",
    zipcode: '',
  },
};
