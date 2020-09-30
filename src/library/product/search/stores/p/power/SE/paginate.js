
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'power',
    nextLinkSelector: 'div#product-list-load-more button.btn.btn-brand',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-section',
    noResultsXPath: '//span[@class="total-qty" and text()=" 0"]',
    openSearchDefinition: null,
    domain: 'power.se',
    zipcode: '',
  },
};
