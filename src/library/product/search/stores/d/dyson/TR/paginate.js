
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'dyson',
    nextLinkSelector: 'a.search-pagination__text.js-search-pagination-link',
    spinnerSelector: '.active .js-search-loader',
    noResultsXPath: '//h2[contains(.,"aramanız hiçbir sonuç vermedi")]',
    domain: 'dyson.com.tr',
    zipcode: '',
  },
};
