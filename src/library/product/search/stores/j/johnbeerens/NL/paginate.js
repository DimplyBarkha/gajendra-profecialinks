
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'johnbeerens',
    nextLinkSelector: 'div.toolbar--bottom li.pages-item-next a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol.product-list li.product-list__item',
    loadedXpath: null,
    noResultsXPath: '//div[contains(text(),"Je zoekopdracht heeft geen resultaten opgeleverd.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'johnbeerens.com',
    zipcode: "''",
  },
};
