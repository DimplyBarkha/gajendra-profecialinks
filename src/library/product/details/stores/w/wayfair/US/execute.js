
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    domain: 'wayfair.com',
    noResultsXPath: '//div[@class="NotFound"]',
  },
};
