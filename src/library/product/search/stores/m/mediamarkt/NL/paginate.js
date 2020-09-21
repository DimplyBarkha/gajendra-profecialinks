
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    nextLinkSelector: 'ul.pagination li.pagination-next a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'ul.products-list',
    noResultsXPath: null,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
};
