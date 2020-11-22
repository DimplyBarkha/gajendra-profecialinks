
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    domain: 'conforama.ch',
    url: 'https://www.conforama.ch/de/recherche-conforama/{searchTerms}',
    loadedSelector: 'div.contentProducts',
    // noResultsXPath: '//section[contains(@class,"emptySearch")]',
    zipcode: '',
  },
};
