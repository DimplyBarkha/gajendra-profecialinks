
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    domain: 'boots.com',
    loadedSelector: 'ol[class*="bv-content-list-reviews"]',
    noResultsXPath: '//div[@id="WC_GenericError_6"] | //meta[@name="pageName"][not(@content="ProductPage")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
