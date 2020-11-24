
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="productimage"] a>div>img',
    noResultsXPath: '//div[@class="nosearch-para"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    zipcode: '',
    domain: 'sportsdirect.com',
  },
};
