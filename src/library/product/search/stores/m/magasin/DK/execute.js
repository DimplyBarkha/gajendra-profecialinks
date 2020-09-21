
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    domain: 'magasin.dk',
    url: 'https://www.magasin.dk/soeg/?q={searchTerms}&search-button=&lang=da_DK',
    loadedSelector: 'div.product-list__grid',
    noResultsXPath: '//div[contains(@class,"search-no-results")]',
  },
};
