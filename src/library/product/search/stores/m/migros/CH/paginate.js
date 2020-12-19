
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    openSearchDefinition: null,
    noResultsXPath: "//p[@class='info-message ng-star-inserted']/text()",
    domain: 'migros.ch',
    zipcode: '',
  },
};
