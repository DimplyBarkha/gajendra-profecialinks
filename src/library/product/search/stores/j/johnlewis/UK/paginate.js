
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'johnlewis',
    // nextLinkSelector: 'nav[class="Pagination_c-pagination__2iG-y c-pagination--bottom Pagination_c-pagination--footer__2c6x8"]>ul>li[class="Pagination_c-pagination__next__1Pq6x Pagination_c-pagination__item__cBJ6v"]>a',
    // nextLinkXpath: '(//a[@data-test="next-btn"])[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.PLP_plp__3vv2c',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.johnlewis.com/search?search-term={searchTerms}&page={page}',
      },
    domain: 'johnlewis.com',
    zipcode: '',
  },
};
