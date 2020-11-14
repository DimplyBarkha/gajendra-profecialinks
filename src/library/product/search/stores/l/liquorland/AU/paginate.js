
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    nextLinkSelector: 'div.Pager button.btnNext',
    nextLinkXpath: null,
    mutationSelector: 'div.products-list-container.loaded',
    spinnerSelector: null,
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
