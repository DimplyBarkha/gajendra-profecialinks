
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'dyson',
    nextLinkSelector: 'a.search-pagination__text.js-search-pagination-link',
    spinnerSelector: '.active .js-search-loader',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"]',
    domain: 'dyson.no',
    zipcode: '',
  },
};