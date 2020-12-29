
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'lyreco',
    // nextLinkSelector: '#ulpagination > li.next > a',
    // 'ul[id="ulpagination"] li[class="next"] a',
    // '#ulpagination > li.next > a',
    // 'div[id="pagination"]>ul>li[class="next"]>a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    // 'div[class="main-container "]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 1,
      template: 'https://www.lyreco.com/webshop/DEDE/search/page/{page}',
      },
    domain: 'lyreco.com',
    zipcode: '',
  },
};
