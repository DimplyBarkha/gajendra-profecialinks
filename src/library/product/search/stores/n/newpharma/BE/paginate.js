
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'newpharma',
    nextLinkSelector: '.next > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product.js-product-row img',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'newpharma.be',
    zipcode: "''",
  },
};
