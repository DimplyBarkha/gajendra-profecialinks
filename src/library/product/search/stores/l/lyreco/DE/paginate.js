
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'lyreco',
    nextLinkSelector: '#ulpagination > li.next > a',
    // 'div[id="pagination"]>ul>li[class="next"]>a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
