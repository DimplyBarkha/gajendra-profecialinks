
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="product-line-item-line"]',
    noResultsXPath: '//p[@class="plp-no-results"]',
    openSearchDefinition: {
      template: 'https://www.bestbuy.com.mx/c/buscar-best-buy/buscar?query={searchTerms}&page={page}',
    },
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
};
