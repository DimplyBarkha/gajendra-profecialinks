
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    domain: 'mediamarkt.pl',
    loadedSelector: 'nav[id="js-topMenu"] a',
    noResultsXPath: null,
    zipcode: '',
  },
};
