
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'joycemayne',
    nextLinkSelector: 'div[id="toolbar-btm"] a[class*="icn-next-page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="category-grid"]',
    noResultsXPath: '//div[contains(@class, "no-result-box")]',
    openSearchDefinition: null,
    domain: 'joycemayne.com.au',
    zipcode: '',
  },
};
