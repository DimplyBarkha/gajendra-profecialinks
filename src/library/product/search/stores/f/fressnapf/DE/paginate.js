
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    nextLinkXpath: '//a[@class="p-item p-item--border"]/i',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'fressnapf.de',
    zipcode: '',
  },
};
