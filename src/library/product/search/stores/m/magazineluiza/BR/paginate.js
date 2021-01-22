
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    nextLinkSelector: 'div.product-showcase-bottom a.forward',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#productShowcaseSearch ul.productShowCase li.product',
    loadedXpath: null,
    noResultsXPath: '//div[@class="nm-not-found-message1"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'magazineluiza.com.br',
    zipcode: "''",
  },
};
