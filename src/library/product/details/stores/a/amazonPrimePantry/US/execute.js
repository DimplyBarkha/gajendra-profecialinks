
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimePantry',
    domain: 'amazon.com',
    loadedSelector: '#altImages li[class*="imageThumbnail"] img',
    noResultsXPath: null,
    zipcode: '10001',
  },
};
