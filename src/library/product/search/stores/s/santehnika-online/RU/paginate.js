
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'santehnika-online',
    nextLinkSelector: 'span[class*="pagination__icon--next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'html body',
    noResultsXPath: '//div[@class="p-search-b-search-result"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'santehnika-online.ru',
    zipcode: '',
  },
};
