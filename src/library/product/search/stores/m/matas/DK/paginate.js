
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    nextLinkSelector: 'div[class="paging"]>a[class="paging__link paging__link--next js-pagingLink "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'matas.dk',
    zipcode: '',
  },
};
