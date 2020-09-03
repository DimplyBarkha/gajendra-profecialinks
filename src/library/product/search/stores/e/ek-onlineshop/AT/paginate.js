
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'ek-onlineshop',
    nextLinkSelector: 'ul[class*="page-list"] > li:last-child > a[class*="js-search-link"]:not([class*="disabled"])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="js-product-list"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'ek-onlineshop.at',
    zipcode: '',
  },
};
