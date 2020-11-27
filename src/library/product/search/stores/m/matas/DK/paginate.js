
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    nextLinkSelector: 'div.paging > a.paging__link.paging__link--next.js-pagingLink > div.paging__icon',
    // 'div.paging > a.paging__link.paging__link--next.js-pagingLink > div'
    // 'div[class="paging"]>a[class="paging__link paging__link--next js-pagingLink "]'
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.js-productListContent',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // {
    //   template: 'https://www.matas.dk/soeg?search-query={searchTerms}&page={page}',
    //   },
    domain: 'matas.dk',
    zipcode: '',
  },
};
