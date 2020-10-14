
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'easycaresolutions',
    nextLinkSelector: 'div[class*="products-grid"] + div[class*="toolbar-products"] li[class*="pages-item-next"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol[class*="product-items"]',
    noResultsXPath: '//div[@class="no-result" and not(contains(@style, "display: none;"))]',
    openSearchDefinition: null,
    domain: 'easycaresolutions.co.uk',
    zipcode: '',
  },
};
