
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    loadedSelector: 'div[class*="pdp__BVRRContainer--container"]',
    noResultsXPath: null,
    reviewUrl: 'https://www.superdrug.com/search?text={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
