
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, span[class="page-number-container"] ul li:last-child a.go-to-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
