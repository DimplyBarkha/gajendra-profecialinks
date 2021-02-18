
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'Woolworths_Mweb',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ng-trigger-staggerFadeInOut div.product-grid--tile',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")] | //h1[contains(text()," There are no products matching your filters. ")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.woolworths.com.au/shop/search/products?searchTerm={searchTerms}&pageNumber={page}',
      pageOffset: 0,
      pageStartNb: 1,
    },
    domain: 'woolworths.com.au',
    zipcode: "''",
  },
};