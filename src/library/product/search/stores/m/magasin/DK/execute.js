
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    domain: 'magasin.dk',
    url: 'https://www.magasin.dk/soeg/?q={searchTerms}',
    loadedSelector: 'div.product-list__grid',
    noResultsXPath: '//div.search-no-results',
  },
};
