
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'PT',
    store: 'lojashampoo_pt',
    nextLinkSelector: 'ul.pagination li:nth-last-child(2) a',
    nextPageUrlSelector: null,
    nextLinkXpath: '//ul[@class="pagination"]/li[position()=last()-1]/a/@href',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lojashampoo.pt',
    zipcode: '',
  },
};
