module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    timeout: 60000,
    url: 'https://www.auchan.fr/recherche?text={searchTerms}',
    loadedSelector: 'div.product-list--container',
    noResultsXPath: '//div[@id="no-result--container"]//h1',
    zipcode: '',
  },
};
