
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'but',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div[class='content-page-liste']",
    noResultsXPath: '//div[@class="no-result-content"]',
    openSearchDefinition: {
      template: 'https://www.but.fr/Common/Search/SearchProductsList?KeyWords={searchTerms}&PageIndex={page}',
    },
    domain: 'but.fr',
    zipcode: '',
  },
};
