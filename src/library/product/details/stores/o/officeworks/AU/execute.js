
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    domain: 'officeworks.com.au',
    loadedSelector: 'div[class*=Product__LoadingWrapper]',
    noResultsXPath: null,
    zipcode: '',
  },
};
