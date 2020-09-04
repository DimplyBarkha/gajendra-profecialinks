
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'worten',
    domain: 'worten.es',
    url: 'https://www.worten.es/search?query={searchTerms}&sortBy=relevance&hitsPerPage=24&page=1',
    loadedSelector: '.w-product__image',
    noResultsXPath: null,
    zipcode: '',
  },
};
