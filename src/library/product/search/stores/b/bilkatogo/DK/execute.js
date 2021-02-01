
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'bilkatogo',
    domain: 'bilkatogo.dk',
    url: 'https://www.bilkatogo.dk/s/?query={searchTerms}',
    loadedSelector: 'a[class*=\'product-card__link\']',
    noResultsXPath: '//div[contains(@class, \'row no-results\')]',
    zipcode: '',
  },
};
