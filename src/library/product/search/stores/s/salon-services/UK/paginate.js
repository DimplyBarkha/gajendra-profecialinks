
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'salon-services',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img[class="tile-image"]',
    noResultsXPath: `//div[@class="no-results_message"][contains(text(),"We're unable to locate any merchandise")] | //p[@class="search-result_result"][contains(text(),"resulted in no products")]`,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'salon-services.com',
    zipcode: '',
  },
};
