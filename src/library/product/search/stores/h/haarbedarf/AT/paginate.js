
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'haarbedarf',
    nextLinkSelector: 'a.next.page-numbers',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'html body',
    noResultsXPath: '//p[contains(@class, "woocommerce-info")]',
    openSearchDefinition: null,
    domain: 'haarbedarf.at',
    zipcode: '',
  },
};
