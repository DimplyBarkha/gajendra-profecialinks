
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    // nextLinkSelector: 'nav[class="Pagination_c-pagination__2iG-y c-pagination--bottom Pagination_c-pagination--footer__2c6x8"]>ul>li[class="Pagination_c-pagination__next__1Pq6x Pagination_c-pagination__item__cBJ6v"]>a',
    // nextLinkXpath: '(//a[@data-test="next-btn"])[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.s-main-slot s-result-list s-search-results sg-row',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.amazon.de/s?k={searchTerms}&ref=sr_pg_{page}',
      },
    domain: 'freshamazon.de',
    zipcode: '',
  },
};
