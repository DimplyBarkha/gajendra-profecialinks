
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'power',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-section',
    noResultsXPath: '//span[@class="total-qty" and text()=" 0"]',
    openSearchDefinition: null,
    domain: 'power.se',
    zipcode: '',
  },
};
