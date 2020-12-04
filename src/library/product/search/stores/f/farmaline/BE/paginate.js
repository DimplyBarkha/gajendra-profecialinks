
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'farmaline',
    nextLinkSelector: 'div.item.last.pager>ul>li:last-child>a.next',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div#loadingPane',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@data-reactroot]/div[contains(.,"Geen producten gevonden")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'farmaline.be',
    zipcode: '',
  },
};
