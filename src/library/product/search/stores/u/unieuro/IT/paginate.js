
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, span[class="page-number-container"] ul li:last-child a.go-to-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: "//div[@id='no-results-message']/p",
    openSearchDefinition: null,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
