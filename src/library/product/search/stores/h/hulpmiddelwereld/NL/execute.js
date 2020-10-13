
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'hulpmiddelwereld',
    domain: 'hulpmiddelwereld.nl',
    url: 'https://www.hulpmiddelwereld.nl/#sqr:(q[{searchTerms}])',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
