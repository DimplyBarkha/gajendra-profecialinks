
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'etos',
    domain: 'etos.nl',
    url: 'https://www.etos.nl/search/?lang=nl_NL&q={searchTerms}',
    loadedSelector: 'div.c-tabs',
    noResultsXPath: '//div[@class="noresults__copy"]',
    zipcode: '',
  },
};
