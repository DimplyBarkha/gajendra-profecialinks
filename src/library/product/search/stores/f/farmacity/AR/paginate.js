
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AR',
    store: 'farmacity',
    nextLinkSelector: 'div.pager.bottom ul.pages li.next:not(.pgEmpty)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.prateleira ul li',
    noResultsXPath: '//div[@class="main-text"]/h2',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'farmacity.com',
    zipcode: '',
  },
};
