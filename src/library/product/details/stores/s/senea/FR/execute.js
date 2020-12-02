
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'senea',
    domain: 'senea.fr',
    loadedSelector: null,
    noResultsXPath: '//section[contains(@class,"page-not-found")]',
    zipcode: '',
  },
};
