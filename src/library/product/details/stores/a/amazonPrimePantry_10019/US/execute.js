
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimePantry_10019',
    domain: 'amazon.com',
    loadedSelector: '#altImages li[class*="imageThumbnail"] img',
    noResultsXPath: null,
    zipcode: '10019',
  },
};
