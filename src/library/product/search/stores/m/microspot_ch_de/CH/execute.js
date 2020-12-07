
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'microspot_ch_de',
    domain: 'microspot.ch',
    url: 'https://www.microspot.ch/fr/search?search={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
