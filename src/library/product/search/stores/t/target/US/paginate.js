
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    nextLinkSelector: 'a[data-test="next"]',
    mutationSelector: 'div[data-test="productGridContainer"]',
    spinnerSelector: null,
    domain: 'target.com',
  },
};
