
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    domain: 'snipes.com',
    loadedSelector: 'div[class="s-pdp l-container js-product-details"]',
    noResultsXPath: 'div[class="l-error-container"]',
    zipcode: '',
  },
};
