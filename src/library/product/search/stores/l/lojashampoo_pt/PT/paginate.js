
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'PT',
    store: 'lojashampoo_pt',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '//ul[@class="pagination"]/li[position()=last()-1]/a[text()=">"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="search"]',
    loadedXpath: null,
    noResultsXPath: '(//div[@id="content"]//div[@class="wrapper"])[2]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lojashampoo.pt',
    zipcode: '',
  },
};
