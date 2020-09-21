module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'ul.products-list div.product-wrapper',
    noResultsXPath: null,
    nextLinkSelector: 'li.pagination-next a[rel="next"]',
    domain: 'mediamarkt.es',
    zipcode: '',
  },
};
