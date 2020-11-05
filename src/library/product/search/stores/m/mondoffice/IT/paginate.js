
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    nextLinkSelector: 'div#Pager>span.next',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div#ResultsSection',
    // noResultsXPath: null,
    // openSearchDefinition: null,
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
