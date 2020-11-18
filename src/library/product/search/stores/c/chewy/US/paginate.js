
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    nextLinkSelector: 'a.cw-pagination__next',
    loadedSelector: 'section.results-products.js-tracked-product-list', //'section[data-list-type="search-results"] article',
    noResultsXPath: '//h1[@class="cw-type__body cw-padding--none"]',
    //openSearchDefinition: null,
    domain: 'chewy.com',
    zipcode: '',
  },
};
