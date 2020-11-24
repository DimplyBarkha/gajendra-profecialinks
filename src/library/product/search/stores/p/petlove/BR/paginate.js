
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null, // 'div[id="catalog-desktop"]',
    noResultsXPath: null, // '//div[@class="container container--limited"]',
    openSearchDefinition: null,
    domain: 'petlove.com.br',
    zipcode: "''",
  },
};
