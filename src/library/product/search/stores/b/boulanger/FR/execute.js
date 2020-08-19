
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    domain: 'boulanger.com',
    url: 'https://www.boulanger.com/resultats?tr={searchTerms}',
    loadedSelector: 'div[class="productListe"]',
    noResultsXPath: '//*[@class="noresultTitle"]',
    zipcode: '',
  },
};
