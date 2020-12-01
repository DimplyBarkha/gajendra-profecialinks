
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'conforama_ch_fr',
    domain: 'conforama.ch',
    url: 'https://www.conforama.ch/fr/recherche-conforama/{searchTerms}',
    loadedSelector: 'div.contentProducts',
    // noResultsXPath: '//section[contains(@class,"emptySearch")]',
    zipcode: '',
  },
};
