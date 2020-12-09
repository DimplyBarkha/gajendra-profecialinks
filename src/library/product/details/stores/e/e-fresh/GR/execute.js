
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'GR',
    store: 'e-fresh',
    domain: 'e-fresh.gr',
    loadedSelector: 'div.container',
    noResultsXPath: '//h1[contains(text(), "Oops")]',
    zipcode: '',
  },
};
