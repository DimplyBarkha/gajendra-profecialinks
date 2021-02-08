
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'IN',
    store: 'Flipkart_Mweb',
    nextLinkSelector: null, // 'nav.yFHi8N > a:last-child[class = _1LKTO3 ]',
    nextLinkXpath: '//a/span[contains(text(), "Next")]/parent::node()',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null, // 'div._3LxdjL._3NzWOH',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
};
