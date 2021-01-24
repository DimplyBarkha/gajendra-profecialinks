
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    nextLinkSelector: 'div.Pager button.btnNext:not([aria-label="Already at last page"])',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.products-list-container.loading',
    loadedSelector: 'div.product-list div.ProductTile',
    loadedXpath: null,
    noResultsXPath: '//div[@class="searched-term"]//div[@class="notfound"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'liquorland.com.au',
    zipcode: "''",
  },
};
