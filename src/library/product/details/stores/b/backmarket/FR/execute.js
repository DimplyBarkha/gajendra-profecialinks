
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    domain: 'backmarket.fr',
    loadedSelector: '.m-container-productmain',
    noResultsXPath: 'div[data-test="search-landing-no-result"]',
    zipcode: '',
  },
};
