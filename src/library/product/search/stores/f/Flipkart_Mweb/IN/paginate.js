
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IN',
    store: 'Flipkart_Mweb',
    nextLinkSelector: '.ge-49M+ ._1LKTO3 span',
    nextPageUrlSelector: null,
    nextLinkXpath: '//a/span[contains(text(), "Next")]/parent::node()',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'html body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
};
