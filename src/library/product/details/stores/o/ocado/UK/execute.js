module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    domain: 'ocado.com',
    loadedSelector: null,
    noResultsXPath: '//*[@class="nf-resourceNotFound"]',
    zipcode: '',
  },
};
