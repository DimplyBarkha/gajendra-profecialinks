
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    nextLinkSelector: null,
    // 'div[class="paging"]>a[class="paging__link paging__link--next js-pagingLink "]'
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.matas.dk/soeg?search-query={searchTerms}&page={page}',
      },
    domain: 'matas.dk',
    zipcode: '',
  },
};
