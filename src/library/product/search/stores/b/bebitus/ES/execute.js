
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    domain: 'bebitus.es',
    url: 'https://www.bebitus.com/search/?q={searchTerms}',
    loadedSelector: 'div.footer-main-container',
    noResultsXPath: '//h1[contains(., "Lo sentimos")]',
    zipcode: '',
  },
};
