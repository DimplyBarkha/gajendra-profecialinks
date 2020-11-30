
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    nextLinkSelector: 'body > div.wrapper.js-wrapper > div.view.view--main.js-view-main > div > div > main > div.productlist > div > div.js-productListContent > div > div.col-xs-12.col-xl-9.col-xxl-10 > div.productlist__bottom > div.paging > a.paging__link.paging__link--next.js-pagingLink',
    // 'div.paging > a.paging__link.paging__link--next.js-pagingLink > div.paging__icon'
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
