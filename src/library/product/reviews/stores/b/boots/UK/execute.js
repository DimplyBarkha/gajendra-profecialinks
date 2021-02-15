
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    domain: 'boots.com',
    loadedSelector: 'ol[class*="bv-content-list-reviews"]',
    noResultsXPath: '//div[@id="WC_GenericError_6"] | //meta[@name="pageName"][not(@content="ProductPage")] | //div[@class="bv-content-list-container"]//div[@class="bv-content-placeholder"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
