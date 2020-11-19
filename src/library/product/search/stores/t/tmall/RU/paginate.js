
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    nextLinkSelector: 'a.page-next.ui-pagination-next', 
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'ul#hs-below-list-items',
    loadedXpath: null,
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'tmall.ru',
    zipcode: '',
  },
};
