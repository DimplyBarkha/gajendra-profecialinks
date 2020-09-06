
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    nextLinkSelector: null,
    loadedSelector: 'div.product-list-container',
    noResultsXPath: '//section[contains(@class, "no-search-result")]',
    domain: 'gigantti.fi',
    zipcode: '',
  },
};
