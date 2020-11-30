
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'dyson',
    nextLinkSelector: 'a.search-pagination__text.js-search-pagination-link',
    spinnerSelector: '.active .js-search-loader',
    noResultsXPath: '//h2[contains(.,"returned no  results")]',
    domain: 'dyson.ae',
    zipcode: '',
  },
};
