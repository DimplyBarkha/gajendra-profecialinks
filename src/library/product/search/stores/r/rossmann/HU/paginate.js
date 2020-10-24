
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'rossmann',
    nextLinkSelector: 'div.next-link a',
    mutationSelector: null,
    spinnerSelector: 'div.please-wait:not([style*="display: none"])',
    loadedSelector: 'div.product-grid-container',
    noResultsXPath: '//div[@class="product-grid-container"]//div[@class="prefixbox-no-result-text"]',
    openSearchDefinition: null,
    domain: 'rossmann.hu',
    zipcode: "''",
  },
};
