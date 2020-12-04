
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    // template: null,
    country: 'PL',
    store: 'doz',
    nextLinkSelector: 'a.pagination__site--next span',
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div#product-list',
    noResultsXPath: '//span[contains(.,"0 produktów")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'doz.pl',
    zipcode: '',
  },
};
