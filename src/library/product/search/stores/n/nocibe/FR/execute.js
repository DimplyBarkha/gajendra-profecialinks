
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    domain: 'nocibe.fr',
    url: 'https://www.nocibe.fr/resultats/{searchTerms}',
    loadedSelector: 'div[class="products-list"]',
    noResultsXPath: '//div[@class="srchrslt noresult"]',
    zipcode: '',
  },
};
