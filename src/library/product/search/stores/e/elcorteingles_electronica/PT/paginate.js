
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'elcorteingles_electronica',
    nextLinkSelector: 'a[data-event="custom_event"]',
    loadedSelector: 'ul.c12.products_list._four',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: '//div[contains(@class,"_no_products")]',
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
