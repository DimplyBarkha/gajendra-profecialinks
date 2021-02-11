
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    loadedSelector: 'div[class*="pdp__BVRRContainer--container"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: 'button[aria-labelledby*="bv-dropdown-reviews-menu"]',
    zipcode: '',
  },
};
