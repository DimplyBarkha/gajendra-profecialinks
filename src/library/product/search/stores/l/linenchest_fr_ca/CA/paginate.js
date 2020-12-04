
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    // template: null,
    country: 'CA',
    store: 'linenchest_fr_ca',
    nextLinkSelector: 'ul.ais-Pagination-list li.ais-Pagination-item--nextPage a',
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'ol.ais-Hits-list li.ais-Hits-item',
    // loadedXpath: null,
    noResultsXPath: '//div[@class="no-results"]//b[contains(.,"Aucun produit pour")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'linenchest.com',
    zipcode: '',
  },
};
