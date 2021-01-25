
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RO',
    store: 'auchan',
    nextLinkSelector: 'li.last.item a.link',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.row.productGrid div.productGridItem.listing',
    //loadedXpath: 'div.row.productGrid div.productGridItem.listing',
    // noResultsXPath: '//b[contains(.,"Niciun produs nu corespunde cautarii tale.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'auchan.ro',
    zipcode: '',
  },
};
