
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    nextLinkSelector: 'li.pagination-next a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'ul.products-list',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.be',
    zipcode: '',
  },
};
