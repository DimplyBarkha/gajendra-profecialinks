
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'marmot',
    nextLinkSelector: 'div.show-more button',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'div.product-grid div.col-xxl-3',
    loadedXpath: null,
    noResultsXPath: '//span[@class="search-result-count" and contains(text(),"Sorry, no product search results found")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'marmot.com',
    zipcode: "''",
  },
};
