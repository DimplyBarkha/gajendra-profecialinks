
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'grofers',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products a.product__wrapper',
    noResultsXPath: '//h1[@class="no-result__msg-main"]',
    openSearchDefinition: null,
    domain: 'grofers.com',
    zipcode: "''",
  },
};
