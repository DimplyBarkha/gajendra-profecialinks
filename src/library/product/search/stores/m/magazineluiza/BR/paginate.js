
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    nextLinkSelector: 'li.neemu-pagination-next a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.neemu-products-container li.nm-product-item',
    loadedXpath: null,
    noResultsXPath: '//div[@class="nm-not-found-message1"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'magazineluiza.com.br',
    zipcode: "''",
  },
};
