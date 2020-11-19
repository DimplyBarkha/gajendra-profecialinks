
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    nextLinkSelector: '#toolbar-btm a[title="Next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#content',
    loadedXpath: null,
    noResultsXPath: '//p[contains(text(),"There are no products matching the selection.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'harveynorman.com.au',
    zipcode: "''",
  },
};
