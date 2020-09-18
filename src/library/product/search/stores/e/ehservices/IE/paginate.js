
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'ehservices',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.scale',
    noResultsXPath: '//*[contains(@class,\'product-listing\')]/div[contains(text(),\'No records\')]',
    openSearchDefinition: null,
    domain: 'ehservices.co.uk',
    zipcode: '',
  },
};
