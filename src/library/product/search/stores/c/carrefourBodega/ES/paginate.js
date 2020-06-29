
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    nextLinkSelector: "div[class='js-next-preference']  a[title*='Ver m']",
    mutationSelector: "div[class*='item-page']",
    spinnerSelector: null,
    // loadedSelector: "div[class*='item-page'] article.item",
    noResultsXPath: "//h1[@id='search_results' and contains(.,'(0)')]",
    openSearchDefinition: null,
    domain: 'carrefour.es',
    zipcode: '',
  },
};
