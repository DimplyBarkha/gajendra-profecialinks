
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="wrapper grid"]',
    noResultsXPath: '//div[contains(@class, "column main") and not(div[@class="search results"])]',
    openSearchDefinition: {
      pageOffset: 0,
      template: 'https://www.emaxme.com/s001/catalogsearch/result/?q={searchTerms}&p={page}'
    },
    domain: 'emaxme.com',
    zipcode: '',
  },
};
