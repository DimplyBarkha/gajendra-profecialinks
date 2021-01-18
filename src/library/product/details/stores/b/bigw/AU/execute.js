
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    domain: 'bigw.com.au',
    loadedSelector: null,
    noResultsXPath: '//h3[contains(text(), "did not return any results")]',
    zipcode: "''",
  },
};
