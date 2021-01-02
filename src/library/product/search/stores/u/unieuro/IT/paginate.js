
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IT',
    store: 'Unieuro',
    // nextLinkSelector: 'main > div.global-pagination > span.pagination-menu > span > div > span > ul > li.active +li > a.go-to-page',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: '.listing-container>main>.items-container',
    loadedXpath: null,
    noResultsXPath: '//div[@id="no-results-message"] | //section[@data-module="compare"][not(section)]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageOffset: -1,
      template: 'https://www.unieuro.it/online/?q={searchTerms}&p={page}',
    },
    domain: 'unieuro.it',
    zipcode: '',
  },
};
