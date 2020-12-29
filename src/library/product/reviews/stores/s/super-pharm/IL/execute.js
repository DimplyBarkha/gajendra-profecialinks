
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'IL',
    store: 'super-pharm',
    domain: 'super-pharm.co.il',
    loadedSelector: 'div.site-wrap>div#content',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
