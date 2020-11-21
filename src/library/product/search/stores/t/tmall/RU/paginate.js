
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    nextLinkSelector: 'div a.page-next.ui-pagination-next', 
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.main-wrap',
    //loadedXpath: null,
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'tmall.ru',
    zipcode: '',
  },
};
