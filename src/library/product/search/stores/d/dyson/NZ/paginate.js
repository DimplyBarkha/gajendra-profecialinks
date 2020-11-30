
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'dyson',
    nextLinkSelector: 'a.search-pagination__text.js-search-pagination-link',
    spinnerSelector: '.active .js-search-loader',
    noResultsXPath: '//h2[contains(.,"returned no  results")]',
    domain: 'dyson.co.nz',
    zipcode: '',
  },
};
