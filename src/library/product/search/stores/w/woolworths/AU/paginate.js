
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
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
