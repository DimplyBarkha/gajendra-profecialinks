module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    domain: 'ao.com',
    loadedSelector: 'section#productInformation',
    noResultsXPath: '//h1[contains(text(), "Sorry - this page no longer exists")]',
    zipcode: '',
  },
};