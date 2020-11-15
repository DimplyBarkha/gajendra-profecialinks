
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.container-fluid>div.more-data-loader > div.container-fluid, container-fluid--max-width',
    loadedXpath: null,
    noResultsXPath: 'not(//div[@class="container-fluid"]/div[@class="more-data-loader"])',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'marionnaud.at',
    zipcode: '',
  },
};
