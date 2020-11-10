
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    domain: 'bebitus.es',
    url: 'https://www.bebitus.com/search/?q={searchTerms}',
    loadedSelector: 'div.wrapper img',
    noResultsXPath: '//h1[contains(., "Lo sentimos")]',
    zipcode: '',
  },
};
