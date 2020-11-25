
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    nextLinkSelector: 'div a.page-next', 
    //nextLinkXpath: '//a[@class="page-next ui-pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.util-clearfix',
    //loadedXpath: null,
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'tmall.ru',
    zipcode: '',
  },
};
