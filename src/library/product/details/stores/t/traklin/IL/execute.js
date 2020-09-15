
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IL',
    store: 'traklin',
    domain: 'traklin.co.il',
    loadedSelector: 'div[class*="prod_wrap"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
