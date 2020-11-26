module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    domain: 'thegoodguys.com.au',
    loadedSelector: 'h1.pdp__main-title',
    noResultsXPath: "//h4[contains(text(),'Sorry, we can’t seem to find the page you’re looking for')]",
    zipcode: '',
  },
};
