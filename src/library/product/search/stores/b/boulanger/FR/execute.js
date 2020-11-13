
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    domain: 'boulanger.com',
    url: 'https://www.boulanger.com/resultats?tr={searchTerms}',
    loadedSelector: 'div.productListe',
    noResultsXPath: '//div[@itemprop="mainContentOfPage"][contains(text(), "0")]',
    zipcode: '',
  },
};
