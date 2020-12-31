
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'power',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-section',
    noResultsXPath: '//h2[contains(@class,"product-qty-header")]/span[@class="total-qty" and text()=" 0"]',
    openSearchDefinition: null,
    domain: 'power.no',
    zipcode: '',
  },
};
