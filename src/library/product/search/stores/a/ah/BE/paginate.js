
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    nextLinkSelector: 'div.f-load-more>button',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: '#search-lane',
    // noResultsXPath: null,
    // openSearchDefinition: null,
    domain: 'ah.be',
    zipcode: '',
  },
};
