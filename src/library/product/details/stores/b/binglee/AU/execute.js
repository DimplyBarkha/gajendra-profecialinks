
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'binglee',
    domain: 'binglee.com.au',
    loadedSelector: 'body',
    noResultsXPath: '//body[@class=" cms-index-noroute cms-no-route"]',
    zipcode: '',
  },
};
