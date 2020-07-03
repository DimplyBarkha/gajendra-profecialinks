
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    loadedSelector: '#altImages li[class*="imageThumbnail"] img',
    noResultsXPath: null,
    zipcode: 'SW1P 3EU',
  },
};
