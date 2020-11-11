
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'bigbasket',
    domain: 'bigbasket.in',
    url: 'https://www.bigbasket.com/ps/?q={SearchTerm}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
