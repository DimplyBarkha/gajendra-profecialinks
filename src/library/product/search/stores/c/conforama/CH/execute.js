
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    domain: 'conforama.ch',
    url: 'https://www.conforama.ch/fr/recherche-conforama/{searchTerms}',
    loadedSelector: 'section[class="main-section"]',
    noResultsXPath: '//section[@class="main-section emptySearch"]',
    zipcode: '',
  },
};
