
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    nextLinkSelector: 'a.pagination-button__next',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div#toolbar__all_anchor',
    // noResultsXPath: null,
    // openSearchDefinition: null,
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
