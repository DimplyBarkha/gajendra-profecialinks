
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'did',
    domain: 'did.ie',
    loadedSelector: 'body.catalog-product-view',
    noResultsXPath: '//body[contains(@class, "catalog-category-view")]',
    zipcode: '',
  },
};
