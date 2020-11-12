
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    domain: 'kohls.com',
    loadedSelector: 'div[id="PDP_colGrid"]',
    noResultsXPath: '//div[@class="pdp_outofstockproduct"]',
    zipcode: '',
  },
};
