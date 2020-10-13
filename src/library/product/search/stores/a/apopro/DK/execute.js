
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'apopro',
    domain: 'apopro.dk',
    url: 'https://apopro.dk/search?query={searchTerms}',
    loadedSelector: 'section.product-item:nth-last-child(1) div.search-thumbnail a img',
    noResultsXPath: '//p[contains(@class,"no-result")]',
    zipcode: '',
  },
};
