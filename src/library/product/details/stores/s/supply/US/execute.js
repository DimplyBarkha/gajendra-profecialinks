
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'supply',
    domain: 'supply.com',
    loadedSelector: 'div[data-testid="productPage"]',
    noResultsXPath: '//section[@class="bono404"]',
    zipcode: '',
  },
};
