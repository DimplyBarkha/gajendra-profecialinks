
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    domain: 'manor.ch',
    url: 'https://www.manor.ch/search/text#/q/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
