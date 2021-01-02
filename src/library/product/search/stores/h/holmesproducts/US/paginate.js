
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    stopConditionSelectorOrXpath: null,
    loadedSelector: 'ul[id*="search-result-items"]',
    noResultsXPath: '//div[contains(@class,"responsive-slot no-hits-container")] | //div[contains(@id,"primary")]/p[contains(text(),"resulted in no products")] | //span[contains(@class,"search-result-count") and contains(.,"no product search result")] | //div[contains(@class, "search-tips")]',
    openSearchDefinition: null,
    domain: 'holmesproducts.com',
    zipcode: '',
  },
};
