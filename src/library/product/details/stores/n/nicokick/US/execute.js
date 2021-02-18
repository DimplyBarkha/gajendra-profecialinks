
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'nicokick',
    domain: 'nicokick.com',
    loadedSelector: 'div.columns',
    noResultsXPath: '//h1[contains(text(),"00PS!")]',
    zipcode: '',
  },
};
