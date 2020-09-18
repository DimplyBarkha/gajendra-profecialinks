
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    nextLinkSelector: null,
    loadedSelector: 'div.product-list-container',
    noResultsXPath: '//div[contains(@class, "recommended-products")]',
    domain: 'gigantti.fi',
    zipcode: '',
  }, 
};
