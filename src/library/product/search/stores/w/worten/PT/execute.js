
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    domain: 'worten.pt',
    url: 'https://www.worten.pt/search?query={searchTerms}&sortBy=relevance&hitsPerPage=24&page=1',
    loadedSelector: '.w-product__image',
    noResultsXPath: null,
    zipcode: '',
  },
};
