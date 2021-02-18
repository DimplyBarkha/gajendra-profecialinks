
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    nextLinkSelector: 'div.paging-section>a.paging-next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.product-grid--tile div.ghostTile-tile',
    loadedSelector: 'main#center-panel',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    /*openSearchDefinition: {
      template: 'https://www.woolworths.com.au/shop/search/products?searchTerm={searchTerms}&pageNumber={page}',
      pageOffset: 0,
      pageStartNb: 1,
    },*/
    domain: 'woolworths.com.au',
    zipcode: "''",
  },
};
