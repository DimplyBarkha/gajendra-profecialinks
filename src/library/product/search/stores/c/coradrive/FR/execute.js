
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    domain: 'coradrive.fr',
    url: 'https://www.cora.fr/recherche?keywords={searchTerms}',
    loadedSelector: 'ul[class*="c-product-list-container-products"] li:last-child',
    noResultsXPath: '//p[contains(@class,"c-search-result-no-suggestion__heading")] | //p[contains(text(),"Site en maintenance")]',
    zipcode: '',
  },
};
