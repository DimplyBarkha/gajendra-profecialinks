
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimePantry',
    domain: 'amazon.co.uk',
    loadedSelector: '#altImages li[class*="imageThumbnail"] img',
    noResultsXPath: null,
  },
};
