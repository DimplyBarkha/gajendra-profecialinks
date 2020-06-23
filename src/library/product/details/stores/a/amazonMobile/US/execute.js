
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    domain: 'amazon.com',
    loadedSelector: '#altImages li[class*="imageThumbnail"] img',
    noResultsXPath: null,
  },
};
